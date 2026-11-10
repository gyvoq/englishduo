import { randomBytes, createHash } from 'node:crypto';
import { wrap, send, body } from '../lib/http.js';
import { redis, pipeline, rateLimit } from '../lib/redis.js';
import { student, shortHash } from '../lib/session.js';
import { content } from '../lib/content.js';
import { checkMessage } from '../lib/moderation.js';

const KEEP = 200;   // mensagens guardadas por aula
const SHOW = 100;   // mensagens enviadas ao app

// Um chat por aula: chave chat:<id da aula>
export default wrap(async (req, res) => {
  const st = await student(req, res);
  if (!st) return send(res, 401, { error: 'O chat é exclusivo para alunos.' });
  const me = shortHash(st.key + '|' + st.device);

  if (req.method === 'GET') {
    const l = String((req.query && req.query.l) || '');
    if (!content().lessons[l]) return send(res, 404, { error: 'Aula não encontrada.' });
    const raw = (await redis('LRANGE', 'chat:' + l, '0', String(SHOW - 1))) || [];
    const msgs = [];
    for (let i = raw.length - 1; i >= 0; i--) {
      try { const m = JSON.parse(raw[i]); msgs.push({ id: m.id, n: m.n, t: m.t, ts: m.ts, me: m.u === me }); } catch {}
    }
    return send(res, 200, { msgs });
  }

  if (req.method === 'POST') {
    const b = await body(req);
    const l = String(b.l || '');
    if (!content().lessons[l]) return send(res, 404, { error: 'Aula não encontrada.' });
    const text = String(b.text || '').replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, '').replace(/\n{3,}/g, '\n\n').trim().slice(0, 300);
    if (!text) return send(res, 400, { error: 'Escreva uma mensagem.' });

    // aluno silenciado por insistir em mensagens bloqueadas
    const muted = await redis('TTL', 'mute:' + me);
    if (Number(muted) > 0) return send(res, 429, { error: 'Você está sem poder enviar mensagens por ' + Math.ceil(muted / 60) + ' min por causa de mensagens bloqueadas.' });

    const bad = checkMessage(text);
    if (bad) {
      const r = await pipeline([['SET', 'strike:' + me, '0', 'EX', '3600', 'NX'], ['INCR', 'strike:' + me]]);
      const strikes = Number(r[1]);
      if (strikes >= 3) {
        await pipeline([['SET', 'mute:' + me, '1', 'EX', String(strikes >= 5 ? 86400 : 1800)], ['DEL', 'strike:' + me]]);
        return send(res, 422, { error: bad + ' Você ficou sem poder enviar mensagens por ' + (strikes >= 5 ? '24 horas' : '30 minutos') + '.', blocked: true });
      }
      return send(res, 422, { error: bad + ' Aviso ' + strikes + ' de 3.', blocked: true });
    }

    const ok = await redis('SET', 'rl:chat:' + me, '1', 'NX', 'EX', '5');
    if (ok !== 'OK') return send(res, 429, { error: 'Calma! Espere alguns segundos entre as mensagens.' });
    if (!(await rateLimit('chat10:' + me, 15, 600))) return send(res, 429, { error: 'Muitas mensagens seguidas. Espere alguns minutos.' });
    const fp = createHash('sha256').update(text.toLowerCase().replace(/\s+/g, ' ')).digest('hex').slice(0, 16);
    const dup = await redis('SET', 'dup:' + me + ':' + fp, '1', 'NX', 'EX', '600');
    if (dup !== 'OK') return send(res, 429, { error: 'Você já enviou essa mensagem.' });
    const m = { id: randomBytes(6).toString('hex'), n: st.name, t: text, ts: Date.now(), u: me };
    await pipeline([['LPUSH', 'chat:' + l, JSON.stringify(m)], ['LTRIM', 'chat:' + l, '0', String(KEEP - 1)]]);
    return send(res, 200, { msg: { id: m.id, n: m.n, t: m.t, ts: m.ts, me: true } });
  }

  send(res, 405, { error: 'Método inválido.' });
});

import { randomBytes } from 'node:crypto';
import { wrap, send, body } from '../lib/http.js';
import { redis, pipeline } from '../lib/redis.js';
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
    const text = String(b.text || '').replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, '').replace(/\n{3,}/g, '\n\n').trim().slice(0, 500);
    if (!text) return send(res, 400, { error: 'Escreva uma mensagem.' });
    const bad = checkMessage(text);
    if (bad) return send(res, 422, { error: bad, blocked: true });
    const ok = await redis('SET', 'rl:chat:' + me, '1', 'NX', 'EX', '3');
    if (ok !== 'OK') return send(res, 429, { error: 'Calma! Espere alguns segundos.' });
    const m = { id: randomBytes(6).toString('hex'), n: st.name, t: text, ts: Date.now(), u: me };
    await pipeline([['LPUSH', 'chat:' + l, JSON.stringify(m)], ['LTRIM', 'chat:' + l, '0', String(KEEP - 1)]]);
    return send(res, 200, { msg: { id: m.id, n: m.n, t: m.t, ts: m.ts, me: true } });
  }

  send(res, 405, { error: 'Método inválido.' });
});

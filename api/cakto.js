// Webhook da Cakto: gera uma chave por compra. O cliente pega o código na página /obrigado com e-mail + CPF.
// Variável na Vercel: CAKTO_WEBHOOK_SECRET
// Opcionais: KEY_MONTHS (padrão 12), KEY_DEVICES (padrão 1)
import { createHash } from 'node:crypto';
import { redis, rateLimit } from '../lib/redis.js';
import { clientIp } from '../lib/http.js';
import { safeEqual } from '../lib/session.js';
import { genKey, createLicense, getLicense, saveLicense } from '../lib/licenses.js';
import { logEvent } from '../lib/logs.js';

function reply(res, status, data) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(data));
}

async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') { try { return JSON.parse(req.body); } catch { return null; } }
  const chunks = []; let size = 0;
  for await (const c of req) { size += c.length; if (size > 512 * 1024) return null; chunks.push(c); }
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch { return null; }
}

const digits = (s) => String(s || '').replace(/\D/g, '');
const buyerKey = (email, cpf) => 'buyer:' + createHash('sha256').update(String(email).trim().toLowerCase() + '|' + digits(cpf)).digest('hex');

// A página de obrigado pergunta e-mail + CPF e recebe o código.
async function claim(req, res) {
  const o = req.headers.origin;
  if (o) { try { if (new URL(o).host !== req.headers.host) return reply(res, 403, { error: 'Origem inválida.' }); } catch { return reply(res, 403, { error: 'Origem inválida.' }); } }
  if (!(await rateLimit('claim:' + clientIp(req), 10, 600))) return reply(res, 429, { error: 'Muitas tentativas. Espere alguns minutos.' });
  const b = (await readBody(req)) || {};
  const email = String(b.email || '').trim().toLowerCase();
  const cpf = digits(b.cpf);
  if (!email.includes('@') || cpf.length < 11) return reply(res, 400, { error: 'Digite o e-mail e o CPF usados na compra.' });
  const key = await redis('GET', buyerKey(email, cpf));
  if (!key) return reply(res, 404, { error: 'Compra não encontrada ainda. Se acabou de pagar, espere 1 minuto e tente de novo. Pix e boleto só liberam depois de compensar.' });
  const l = await getLicense(key);
  if (!l || l.revoked) return reply(res, 403, { error: 'Esta compra foi cancelada ou reembolsada.' });
  reply(res, 200, { key });
}

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return reply(res, 405, { error: 'method' });
    if (req.query && req.query.claim) return claim(req, res);
    const secret = process.env.CAKTO_WEBHOOK_SECRET || '';
    const b = await readBody(req);
    if (!secret || !b || !safeEqual(String(b.secret || ''), secret)) return reply(res, 401, { error: 'secret' });

    const items = Array.isArray(b.data) ? b.data : b.data ? [b.data] : [];
    const main = items.find((x) => x && x.offer_type === 'main') || items[0];
    if (!main) return reply(res, 200, { ok: true, skip: 'sem dados' });
    const order = String(main.refId || main.id || '');
    if (!order) return reply(res, 200, { ok: true, skip: 'sem pedido' });
    const ok = 'order:' + order;

    if (b.event === 'purchase_approved') {
      const email = String(main.customer?.email || '').trim().toLowerCase();
      if (!email) return reply(res, 200, { ok: true, skip: 'sem e-mail' });
      let rec = null;
      try { rec = JSON.parse((await redis('GET', ok)) || 'null'); } catch {}
      if (!rec) {
        const months = [1, 3, 6, 12].includes(Number(process.env.KEY_MONTHS)) ? Number(process.env.KEY_MONTHS) : 12;
        const devices = Math.min(10, Math.max(1, parseInt(process.env.KEY_DEVICES, 10) || 1));
        let lic = null;
        for (let i = 0; i < 5 && !lic; i++) {
          const l = { key: genKey(), createdAt: Date.now(), months, start: null, end: null, devices, desc: email + ' · ' + order, members: [], order, email };
          if (await createLicense(l)) lic = l;
        }
        if (!lic) throw new Error('Não gerou chave');
        rec = { key: lic.key, email, name: main.customer?.name || '' };
        // NX: se a Cakto mandar duas vezes ao mesmo tempo, só uma chave vale
        const set = await redis('SET', ok, JSON.stringify(rec), 'NX');
        if (set !== 'OK') rec = JSON.parse(await redis('GET', ok));
      }
      const cpf = digits(main.customer?.docNumber);
      if (cpf) await redis('SET', buyerKey(rec.email, cpf), rec.key);
      return reply(res, 200, { ok: true });
    }

    if (b.event === 'refund' || b.event === 'chargeback') {
      let rec = null;
      try { rec = JSON.parse((await redis('GET', ok)) || 'null'); } catch {}
      const l = rec && (await getLicense(rec.key));
      if (l && !l.revoked) {
        l.revoked = true; l.revokedAt = Date.now();
        await saveLicense(l);
        await logEvent(l.key, 'revoke', null, { why: b.event });
      }
      return reply(res, 200, { ok: true });
    }

    reply(res, 200, { ok: true, skip: b.event });
  } catch (e) {
    console.error(e);
    reply(res, 500, { error: 'erro' });
  }
}

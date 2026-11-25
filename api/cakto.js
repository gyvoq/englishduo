// Webhook da Cakto: gera uma chave por compra e manda por e-mail.
// Variáveis na Vercel: CAKTO_WEBHOOK_SECRET, RESEND_API_KEY, EMAIL_FROM
// Opcionais: KEY_MONTHS (padrão 12), KEY_DEVICES (padrão 1)
import { redis } from '../lib/redis.js';
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

const esc = (s) => String(s || '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

async function sendKey(to, name, key) {
  const first = String(name || '').trim().split(/\s+/)[0] || '';
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + process.env.RESEND_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM,
      to: [to],
      subject: 'Seu código de acesso EnglishDuo',
      html: '<div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;text-align:center">' +
        '<h2>Obrigado pela compra' + (first ? ', ' + esc(first) : '') + '!</h2>' +
        '<p>Seu código de acesso:</p>' +
        '<p style="font-size:24px;font-weight:bold;color:#D7191F;letter-spacing:1px">' + key + '</p>' +
        '<p><a href="https://englishduo.vercel.app/?chave=' + key + '" style="display:inline-block;background:#D7191F;color:#fff;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:bold">Entrar agora</a></p>' +
        '<p style="color:#777;font-size:13px">Guarde este e-mail. O código é pessoal.</p></div>'
    })
  });
  if (!r.ok) throw new Error('E-mail falhou: ' + r.status + ' ' + (await r.text().catch(() => '')));
}

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return reply(res, 405, { error: 'method' });
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
        rec = { key: lic.key, email, name: main.customer?.name || '', sent: false };
        // NX: se a Cakto mandar duas vezes ao mesmo tempo, só uma chave vale
        const set = await redis('SET', ok, JSON.stringify(rec), 'NX');
        if (set !== 'OK') rec = JSON.parse(await redis('GET', ok));
      }
      if (!rec.sent) {
        await sendKey(rec.email, rec.name, rec.key); // se falhar, responde 500 e a Cakto tenta de novo
        rec.sent = true;
        await redis('SET', ok, JSON.stringify(rec));
      }
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

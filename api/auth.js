import { wrap, send, body, clientIp } from '../lib/http.js';
import { redis, rateLimit } from '../lib/redis.js';
import { student, deviceId, startSession, endSession, meOf } from '../lib/session.js';
import { normKey, getLicense, saveLicense, statusOf, addMonths } from '../lib/licenses.js';

function cleanName(s) {
  return String(s || '').replace(/[\u0000-\u001f\u007f<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, 40);
}
const fmt = (ts) => new Date(ts).toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });

async function login(req, res) {
  if (!(await rateLimit('login:' + clientIp(req), 20, 600))) return send(res, 429, { error: 'Muitas tentativas. Espere alguns minutos.' });
  const b = await body(req);
  const key = normKey(b.key);
  if (!key) return send(res, 400, { error: 'Chave inválida. Confira e tente de novo.' });
  const lic = await getLicense(key);
  if (!lic) return send(res, 404, { error: 'Chave inválida. Confira e tente de novo.' });

  const st = statusOf(lic);
  if (st === 'revoked') return send(res, 403, { error: 'Esta chave foi desativada.' });
  if (st === 'expired') return send(res, 403, { error: 'Esta chave expirou.' });

  const now = Date.now();
  const device = deviceId(req, res);

  if (st === 'unused') {
    if (lic.start && now < lic.start) return send(res, 403, { error: 'Esta chave vale a partir de ' + fmt(lic.start) + '.' });
    const name = cleanName(b.name);
    if (!name) return send(res, 200, { need: 'name' });
    if (name.length < 2) return send(res, 400, { error: 'Digite seu nome.', need: 'name' });
    lic.name = name;
    lic.activatedAt = now;
    lic.expiresAt = lic.months ? addMonths(now, lic.months) : lic.end || null;
    lic.deviceIds = [device];
    await saveLicense(lic);
  } else {
    lic.deviceIds = lic.deviceIds || [];
    if (!lic.deviceIds.includes(device)) {
      if (lic.deviceIds.length >= (lic.devices || 1)) {
        return send(res, 403, { error: 'Limite de aparelhos desta chave atingido. Fale com o suporte.' });
      }
      lic.deviceIds.push(device);
      await saveLicense(lic);
    }
  }
  startSession(res, lic, device);
  send(res, 200, { ok: true, me: meOf({ key: lic.key, name: lic.name, exp: lic.expiresAt }) });
}

const QID = /^[a-z0-9-]{3,64}$/;

export default wrap(async (req, res) => {
  const action = (req.query && req.query.action) || '';

  if (req.method === 'POST' && action === 'login') return login(req, res);
  if (req.method === 'POST' && action === 'logout') { endSession(res); return send(res, 200, { ok: true }); }

  if (action === 'progress') {
    const st = await student(req, res);
    if (!st) return send(res, 401, { error: 'Entre com sua chave.' });
    const pk = 'prog:' + st.key;
    let cur = {};
    try { cur = JSON.parse((await redis('GET', pk)) || '{}') || {}; } catch { cur = {}; }
    if (req.method === 'GET') return send(res, 200, { p: cur });
    if (req.method === 'PUT' || req.method === 'POST') {
      const b = await body(req);
      if (b.reset === true) { await redis('DEL', pk); return send(res, 200, { p: {} }); }
      const inc = b && typeof b.p === 'object' && b.p ? b.p : {};
      let n = 0;
      for (const k in inc) {
        if (++n > 3000) break;
        if (QID.test(k) && (inc[k] === 0 || inc[k] === 1)) cur[k] = inc[k];
      }
      await redis('SET', pk, JSON.stringify(cur));
      return send(res, 200, { p: cur });
    }
  }
  send(res, 404, { error: 'Ação inválida.' });
});

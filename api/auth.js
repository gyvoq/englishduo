import { wrap, send, body, clientIp } from '../lib/http.js';
import { redis, rateLimit } from '../lib/redis.js';
import { student, readDevice, newDeviceId, setDevice, startSession, endSession, meOf } from '../lib/session.js';
import { cleanHw, findSameDevice, touchMember } from '../lib/device.js';
import { checkName } from '../lib/moderation.js';
import { normKey, getLicense, saveLicense, statusOf, addMonths, members } from '../lib/licenses.js';

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
  if (st === 'unused' && lic.start && now < lic.start) return send(res, 403, { error: 'Esta chave vale a partir de ' + fmt(lic.start) + '.' });

  const list = members(lic);
  const hw = cleanHw(b.hw);
  const ip = clientIp(req);
  // 1) mesmo navegador de antes (cookie)  2) outro navegador do MESMO aparelho (hardware + rede)  3) aparelho novo
  let mine = list.find((m) => m.id === readDevice(req)) || findSameDevice(list, hw, ip, now);
  const device = mine ? mine.id : readDevice(req) || newDeviceId();
  if (!mine && list.length >= (lic.devices || 1)) {
    return send(res, 403, { error: 'Limite de aparelhos desta chave atingido. Se este é um aparelho que você já usou, abra pelo mesmo navegador ou pela mesma internet (Wi-Fi) de antes. Se não for, fale com o suporte.' });
  }
  setDevice(req, res, device);

  // Todo login pede o nome de quem está entrando neste aparelho.
  const name = cleanName(b.name);
  if (!name) return send(res, 200, { need: 'name', suggest: mine ? mine.name : '' });
  if (name.length < 2) return send(res, 400, { error: 'Digite seu nome.', need: 'name' });
  const badName = checkName(name);
  if (badName) return send(res, 400, { error: badName, need: 'name' });

  if (st === 'unused') {
    lic.activatedAt = now;
    lic.expiresAt = lic.months ? addMonths(now, lic.months) : lic.end || null;
  }
  if (mine) mine.name = name;
  else { mine = { id: device, name, at: now }; list.push(mine); }
  touchMember(mine, hw, ip, now);
  delete lic.deviceIds;
  delete lic.name;
  await saveLicense(lic);

  const st2 = startSession(res, lic, device, name);
  send(res, 200, { ok: true, did: device, st: st2, me: meOf({ key: lic.key, name, exp: lic.expiresAt }) });
}

const QID = /^[a-z0-9-]{3,64}$/;

export default wrap(async (req, res) => {
  const action = (req.query && req.query.action) || '';

  if (req.method === 'POST' && action === 'login') return login(req, res);
  if (req.method === 'POST' && action === 'logout') { endSession(res); return send(res, 200, { ok: true }); }

  // Quem já estava logado manda a impressão do aparelho (para ser reconhecido em outros navegadores).
  if (req.method === 'POST' && action === 'hw') {
    const st = await student(req, res);
    if (!st) return send(res, 401, { error: 'Entre com sua chave.' });
    if (!(await rateLimit('hw:' + st.key + ':' + st.device, 20, 3600))) return send(res, 429, { error: 'Muitas tentativas.' });
    const hw = cleanHw((await body(req)).hw);
    if (!hw) return send(res, 400, { error: 'Dados inválidos.' });
    const lic = await getLicense(st.key);
    const me = lic && members(lic).find((m) => m.id === st.device);
    if (me && touchMember(me, hw, clientIp(req))) await saveLicense(lic);
    return send(res, 200, { ok: true });
  }

  if (action === 'progress') {
    const st = await student(req, res);
    if (!st) return send(res, 401, { error: 'Entre com sua chave.' });
    const pk = 'prog:' + st.key + ':' + st.device;
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

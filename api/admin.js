import { wrap, send, body, clientIp } from '../lib/http.js';
import { redis, pipeline, rateLimit } from '../lib/redis.js';
import { content } from '../lib/content.js';
import { isAdmin, startAdmin, endAdmin, safeEqual } from '../lib/session.js';
import { genKey, normKey, getLicense, saveLicense, createLicense, listLicenses, deleteLicense, statusOf, dayStart, dayEnd, members } from '../lib/licenses.js';

const YMD = /^\d{4}-\d{2}-\d{2}$/;

function row(l) {
  const ms = members(l);
  return {
    key: l.key, status: statusOf(l), desc: l.desc || '', names: ms.map((m) => m.name),
    createdAt: l.createdAt, activatedAt: l.activatedAt || null, expiresAt: l.expiresAt || null,
    months: l.months || null, start: l.start || null, end: l.end || null,
    devices: l.devices || 1, used: ms.length
  };
}

const actions = {
  async list() {
    return { licenses: (await listLicenses()).map(row) };
  },

  async create(b) {
    const devices = Math.min(10, Math.max(1, parseInt(b.devices, 10) || 1));
    const qty = Math.min(50, Math.max(1, parseInt(b.qty, 10) || 1));
    const desc = String(b.desc || '').replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, 100);
    let months = null, start = null, end = null;
    if (b.start || b.end) {
      if (!YMD.test(b.start || '') || !YMD.test(b.end || '')) return { status: 400, error: 'Escolha as datas de início e fim.' };
      start = dayStart(b.start); end = dayEnd(b.end);
      if (!(end > start)) return { status: 400, error: 'A data final precisa ser depois da inicial.' };
    } else {
      months = parseInt(b.months, 10);
      if (![1, 3, 6, 12].includes(months)) return { status: 400, error: 'Validade inválida.' };
    }
    const keys = [];
    let tries = 0;
    while (keys.length < qty && tries++ < qty * 5) {
      const lic = { key: genKey(), createdAt: Date.now(), months, start, end, devices, desc, members: [] };
      if (await createLicense(lic)) keys.push(lic.key);
    }
    return { keys };
  },

  async revoke(b) {
    const l = await getLicense(normKey(b.key));
    if (!l) return { status: 404, error: 'Chave não encontrada.' };
    l.revoked = true; l.revokedAt = Date.now();
    await saveLicense(l);
    return { ok: true };
  },

  async resetDevices(b) {
    const l = await getLicense(normKey(b.key));
    if (!l) return { status: 404, error: 'Chave não encontrada.' };
    l.members = [];
    delete l.deviceIds;
    await saveLicense(l);
    return { ok: true };
  },

  async delete(b) {
    const k = normKey(b.key);
    if (!k) return { status: 400, error: 'Chave inválida.' };
    const l = await getLicense(k);
    await deleteLicense(k, l ? members(l).map((m) => m.id) : []);
    return { ok: true };
  },

  async chatList() {
    const lessons = Object.values(content().lessons);
    const res = await pipeline(lessons.map((l) => ['LRANGE', 'chat:' + l.id, '0', '99']));
    const msgs = [];
    res.forEach((raw, i) => {
      const l = lessons[i];
      (raw || []).forEach((r) => {
        try { const m = JSON.parse(r); msgs.push({ id: m.id, n: m.n, t: m.t, ts: m.ts, l: l.id, lt: 'Módulo ' + l.id.split('-')[0].slice(1) + ' · ' + l.title }); } catch {}
      });
    });
    msgs.sort((a, b) => b.ts - a.ts);
    return { msgs: msgs.slice(0, 300) };
  },

  async chatDelete(b) {
    const l = String(b.l || '');
    if (!content().lessons[l]) return { status: 404, error: 'Aula não encontrada.' };
    const raw = (await redis('LRANGE', 'chat:' + l, '0', '-1')) || [];
    const hit = raw.find((r) => { try { return JSON.parse(r).id === b.id; } catch { return false; } });
    if (hit) await redis('LREM', 'chat:' + l, '1', hit);
    return { ok: true };
  }
};

export default wrap(async (req, res) => {
  if (req.method !== 'POST') return send(res, 405, { error: 'Método inválido.' });
  const b = await body(req);

  if (b.action === 'login') {
    const pass = process.env.ADMIN_PASSWORD || '';
    if (pass.length < 8) return send(res, 500, { error: 'Defina ADMIN_PASSWORD (mín. 8 caracteres) na Vercel.' });
    if (!(await rateLimit('admin:' + clientIp(req), 8, 900))) return send(res, 429, { error: 'Muitas tentativas. Espere 15 minutos.' });
    if (!safeEqual(String(b.password || ''), pass)) return send(res, 401, { error: 'Senha incorreta.' });
    startAdmin(res);
    return send(res, 200, { ok: true });
  }
  if (b.action === 'logout') { endAdmin(res); return send(res, 200, { ok: true }); }
  if (!isAdmin(req)) return send(res, 401, { error: 'Sessão expirada. Entre de novo.', auth: false });

  const fn = actions[b.action];
  if (!fn) return send(res, 400, { error: 'Ação inválida.' });
  const out = await fn(b);
  if (out && out.error) return send(res, out.status || 400, { error: out.error });
  send(res, 200, out);
});

import { createHmac, createHash, timingSafeEqual, randomBytes } from 'node:crypto';
import { cookies, addCookie } from './http.js';
import { getLicense, statusOf, members } from './licenses.js';

const S_COOKIE = 'ed_s';
const D_COOKIE = 'ed_d';
const A_COOKIE = 'ed_a';
const RECHECK_MS = 60 * 1000; // revalida a chave no banco a cada 1 min
const SESSION_DAYS = 60;

function secret() {
  const s = process.env.SESSION_SECRET || '';
  if (s.length < 24) throw new Error('SESSION_SECRET ausente ou curto (mín. 24 caracteres).');
  return s;
}
const b64u = (b) => Buffer.from(b).toString('base64url');

export function sign(obj) {
  const p = b64u(JSON.stringify(obj));
  return p + '.' + createHmac('sha256', secret()).update(p).digest('base64url');
}

export function unsign(tok) {
  if (!tok || typeof tok !== 'string') return null;
  const i = tok.lastIndexOf('.');
  if (i < 1) return null;
  const p = tok.slice(0, i);
  const sig = Buffer.from(tok.slice(i + 1));
  const exp = Buffer.from(createHmac('sha256', secret()).update(p).digest('base64url'));
  if (sig.length !== exp.length || !timingSafeEqual(sig, exp)) return null;
  try { return JSON.parse(Buffer.from(p, 'base64url').toString('utf8')); } catch { return null; }
}

export function safeEqual(a, b) {
  const x = createHash('sha256').update(String(a)).digest();
  const y = createHash('sha256').update(String(b)).digest();
  return timingSafeEqual(x, y);
}

export function shortHash(s) { return createHash('sha256').update(secret() + '|' + s).digest('hex').slice(0, 12); }

// Identificador do aparelho (cookie HttpOnly de longa duração).
export function deviceId(req, res) {
  let d = cookies(req)[D_COOKIE];
  if (!d || !/^[A-Za-z0-9_-]{22}$/.test(d)) {
    d = b64u(randomBytes(16));
    addCookie(res, D_COOKIE, d, { maxAge: 60 * 60 * 24 * 730 });
  }
  return d;
}

export function startSession(res, lic, device, name) {
  addCookie(res, S_COOKIE, sign({ k: lic.key, d: device, v: Date.now(), n: name, e: lic.expiresAt || null }), { maxAge: 60 * 60 * 24 * SESSION_DAYS });
}

export function endSession(res) { addCookie(res, S_COOKIE, '', { maxAge: 0 }); }

export function licenseProblem(lic, device) {
  if (!lic) return 'Chave não encontrada.';
  const st = statusOf(lic);
  if (st === 'revoked') return 'Esta chave foi desativada.';
  if (st === 'expired') return 'Esta chave expirou.';
  if (device && !members(lic).some((m) => m.id === device)) return 'Este aparelho não está mais autorizado.';
  return null;
}

// Retorna o aluno logado ou null. Revalida no banco no máximo 1x por minuto.
export async function student(req, res) {
  const c = cookies(req);
  const s = unsign(c[S_COOKIE]);
  if (!s || !s.k || !s.d) return null;
  if (s.d !== c[D_COOKIE]) { endSession(res); return null; }
  if (Date.now() - (s.v || 0) < RECHECK_MS && s.n) return { key: s.k, name: s.n, device: s.d, exp: s.e || null };
  const lic = await getLicense(s.k);
  if (licenseProblem(lic, s.d)) { endSession(res); return null; }
  const name = members(lic).find((m) => m.id === s.d).name;
  addCookie(res, S_COOKIE, sign({ k: lic.key, d: s.d, v: Date.now(), n: name, e: lic.expiresAt || null }), { maxAge: 60 * 60 * 24 * SESSION_DAYS });
  return { key: lic.key, name, device: s.d, exp: lic.expiresAt || null, lic };
}

// ---- admin ----
function adminVersion() { return createHash('sha256').update('adm|' + (process.env.ADMIN_PASSWORD || '')).digest('hex').slice(0, 16); }

export function startAdmin(res) {
  addCookie(res, A_COOKIE, sign({ adm: 1, h: adminVersion(), exp: Date.now() + 12 * 3600 * 1000 }), { maxAge: 12 * 3600, path: '/api/admin' });
}
export function endAdmin(res) { addCookie(res, A_COOKIE, '', { maxAge: 0, path: '/api/admin' }); }
export function isAdmin(req) {
  const a = unsign(cookies(req)[A_COOKIE]);
  return !!(a && a.adm === 1 && a.h === adminVersion() && a.exp > Date.now());
}

export function meOf(st) {
  if (!st) return null;
  return { name: st.name, key: st.key.slice(0, 7) + '-••••-••••', exp: st.exp || null };
}

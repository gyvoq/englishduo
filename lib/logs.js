// Registro de uso de cada chave: quem entrou, quando, de onde e com qual navegador.
// Fica em uma lista no Redis (log:<chave>), com as últimas 300 entradas, por 6 meses.
import { pipeline, redis } from './redis.js';
import { clientIp } from './http.js';

const MAX = 300;
const KEEP_SEC = 60 * 60 * 24 * 186; // ~6 meses (Marco Civil da Internet, art. 15)

export function uaLabel(ua) {
  ua = String(ua || '');
  const b = /SamsungBrowser/i.test(ua) ? 'Samsung Internet'
    : /EdgA?\//i.test(ua) ? 'Edge'
    : /OPR\/|Opera/i.test(ua) ? 'Opera'
    : /FxiOS|Firefox/i.test(ua) ? 'Firefox'
    : /CriOS|Chrome/i.test(ua) ? 'Chrome'
    : /Safari/i.test(ua) ? 'Safari' : 'Outro navegador';
  const os = /Android/i.test(ua) ? 'Android'
    : /iPhone|iPod/i.test(ua) ? 'iPhone'
    : /iPad/i.test(ua) ? 'iPad'
    : /Windows/i.test(ua) ? 'Windows'
    : /CrOS/i.test(ua) ? 'Chromebook'
    : /Mac OS X|Macintosh/i.test(ua) ? 'Mac'
    : /Linux/i.test(ua) ? 'Linux' : '';
  return os ? b + ' · ' + os : b;
}

// ev: login | limit | denied | access | logout | revoke | reset
// Nunca derruba a requisição: se o log falhar, só avisa no console.
export async function logEvent(key, ev, req, extra = {}) {
  if (!key) return;
  const e = { t: Date.now(), ev, ...extra };
  if (req) {
    e.ip = String(clientIp(req)).slice(0, 64);
    e.ua = uaLabel(req.headers['user-agent']);
  }
  for (const k in e) if (e[k] === undefined || e[k] === null || e[k] === '') delete e[k];
  try {
    await pipeline([
      ['LPUSH', 'log:' + key, JSON.stringify(e)],
      ['LTRIM', 'log:' + key, '0', String(MAX - 1)],
      ['EXPIRE', 'log:' + key, String(KEEP_SEC)]
    ]);
  } catch (err) { console.error('log falhou', err); }
}

export async function getLogs(key) {
  const raw = (await redis('LRANGE', 'log:' + key, '0', String(MAX - 1))) || [];
  const out = [];
  raw.forEach((r) => { try { out.push(JSON.parse(r)); } catch {} });
  return out;
}

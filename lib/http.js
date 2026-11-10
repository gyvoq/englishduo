export function send(res, status, data, extra = {}) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  for (const k in extra) res.setHeader(k, extra[k]);
  res.end(JSON.stringify(data));
}

export function cookies(req) {
  const out = {};
  const h = req.headers.cookie || '';
  h.split(';').forEach((p) => {
    const i = p.indexOf('=');
    if (i > 0) {
      const k = p.slice(0, i).trim();
      try { out[k] = decodeURIComponent(p.slice(i + 1).trim()); } catch { out[k] = ''; }
    }
  });
  return out;
}

export function addCookie(res, name, value, { maxAge, path = '/' } = {}) {
  let c = `${name}=${encodeURIComponent(value)}; Path=${path}; HttpOnly; Secure; SameSite=Lax`;
  if (maxAge !== undefined) c += `; Max-Age=${maxAge}`;
  const prev = res.getHeader('Set-Cookie');
  res.setHeader('Set-Cookie', prev ? [].concat(prev, c) : [c]);
}

export function clientIp(req) {
  const f = req.headers['x-forwarded-for'];
  return (f ? String(f).split(',')[0] : req.headers['x-real-ip'] || req.socket?.remoteAddress || 'x').trim();
}

export async function body(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') { try { return JSON.parse(req.body); } catch { return {}; } }
  const chunks = [];
  let size = 0;
  for await (const c of req) { size += c.length; if (size > 64 * 1024) break; chunks.push(c); }
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}'); } catch { return {}; }
}

// Bloqueia POST vindo de outro site (CSRF).
export function sameOrigin(req) {
  const o = req.headers.origin;
  if (!o) return true;
  try { return new URL(o).host === req.headers.host; } catch { return false; }
}

export function wrap(fn) {
  return async (req, res) => {
    try {
      if (req.method !== 'GET' && !sameOrigin(req)) return send(res, 403, { error: 'Origem inválida.' });
      await fn(req, res);
    } catch (e) {
      console.error(e);
      if (!res.headersSent) send(res, 500, { error: 'Erro no servidor. Tente de novo.' });
    }
  };
}

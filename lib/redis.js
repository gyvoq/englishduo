// Cliente mínimo para Upstash Redis (REST). Sem dependências.
const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

function check() {
  if (!URL_ || !TOKEN) throw new Error('Banco de dados não configurado (KV_REST_API_URL / KV_REST_API_TOKEN).');
}

export async function redis(...cmd) {
  check();
  const r = await fetch(URL_, {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify(cmd)
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || j.error) throw new Error('Redis: ' + (j.error || r.status));
  return j.result;
}

export async function pipeline(cmds) {
  if (!cmds.length) return [];
  check();
  const r = await fetch(URL_.replace(/\/$/, '') + '/pipeline', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify(cmds)
  });
  const j = await r.json().catch(() => null);
  if (!r.ok || !Array.isArray(j)) throw new Error('Redis pipeline: ' + r.status);
  return j.map((x) => (x && x.error ? null : x.result));
}

// Limite de tentativas: true se ainda pode tentar.
export async function rateLimit(key, max, windowSec) {
  const r = await pipeline([
    ['SET', 'rl:' + key, '0', 'EX', String(windowSec), 'NX'],
    ['INCR', 'rl:' + key]
  ]);
  return Number(r[1]) <= max;
}

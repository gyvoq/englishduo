import { createDecipheriv, createHmac, timingSafeEqual } from 'node:crypto';
import { gunzipSync } from 'node:zlib';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import blob from './content-data.js';

let cache = null;

function key() {
  const k = Buffer.from(process.env.CONTENT_KEY || '', 'base64');
  if (k.length !== 32) throw new Error('CONTENT_KEY ausente ou inválida.');
  return k;
}

export function decrypt(buf) {
  const d = createDecipheriv('aes-256-gcm', key(), buf.subarray(0, 12));
  d.setAuthTag(buf.subarray(12, 28));
  return Buffer.concat([d.update(buf.subarray(28)), d.final()]);
}

export function content() {
  if (!cache) {
    const c = JSON.parse(gunzipSync(decrypt(Buffer.from(blob, 'base64'))).toString('utf8'));
    c.lessons = {};
    c.pdfs = {};
    c.course.forEach((m) => m.lessons.forEach((l) => {
      c.lessons[l.id] = l;
      l.pdfs.forEach((p) => { c.pdfs[p.id] = { ...p, lesson: l }; });
    }));
    cache = c;
  }
  return cache;
}

// O que cada tipo de usuário recebe. Visitante: só as questões grátis e os nomes das aulas.
export function catalog(member) {
  const c = content();
  const modules = c.modules.map((m) => {
    const free = c.free[m.id] || 0;
    const q = member ? m.q : m.q.slice(0, free);
    return { id: m.id, name: m.name, icon: m.icon, cat: m.cat, lvl: m.lvl, desc: m.desc, total: m.q.length, q };
  });
  const course = c.course.map((m) => ({
    n: m.n, title: m.title, level: m.level, goal: m.goal,
    lessons: m.lessons.map((l) => member
      ? { id: l.id, title: l.title, kind: l.kind, desc: l.desc, pdfs: l.pdfs }
      : { id: l.id, title: l.title, kind: l.kind })
  }));
  return { modules, free: c.free, course };
}

export function readPdf(id) {
  if (!/^[a-f0-9]{12}$/.test(id) || !content().pdfs[id]) return null;
  const file = path.join(process.cwd(), 'data', 'pdf', id + '.bin');
  return decrypt(readFileSync(file));
}

// Token curto para o player (vale 2 minutos, preso à chave e ao aparelho do aluno).
export function videoToken(lessonId, licKey, device) {
  const exp = Date.now() + 120 * 1000;
  const p = Buffer.from(JSON.stringify({ l: lessonId, k: licKey, d: device, x: exp })).toString('base64url');
  const s = createHmac('sha256', 'v|' + process.env.SESSION_SECRET).update(p).digest('base64url');
  return p + '.' + s;
}

export function readVideoToken(t) {
  const i = String(t || '').lastIndexOf('.');
  if (i < 1) return null;
  const p = t.slice(0, i);
  const s = createHmac('sha256', 'v|' + process.env.SESSION_SECRET).update(p).digest('base64url');
  const a = Buffer.from(s), b = Buffer.from(t.slice(i + 1));
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const o = JSON.parse(Buffer.from(p, 'base64url').toString('utf8'));
    return o.x > Date.now() ? o : null;
  } catch { return null; }
}

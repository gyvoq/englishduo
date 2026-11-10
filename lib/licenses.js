import { randomInt } from 'node:crypto';
import { redis, pipeline } from './redis.js';

const ALPHA = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const TZ = '-03:00'; // horário de Brasília

export function genKey() {
  let s = '';
  for (let i = 0; i < 12; i++) s += ALPHA[randomInt(ALPHA.length)];
  return 'ED-' + s.slice(0, 4) + '-' + s.slice(4, 8) + '-' + s.slice(8);
}

// Aceita "ed-abcd-efgh-jkmn", "ABCDEFGHJKMN", com espaços etc.
export function normKey(input) {
  let s = String(input || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (s.length === 14 && s.startsWith('ED')) s = s.slice(2);
  if (s.length !== 12) return null;
  for (const ch of s) if (!ALPHA.includes(ch)) return null;
  return 'ED-' + s.slice(0, 4) + '-' + s.slice(4, 8) + '-' + s.slice(8);
}

export function addMonths(ts, m) {
  const d = new Date(ts);
  const day = d.getUTCDate();
  d.setUTCMonth(d.getUTCMonth() + m);
  if (d.getUTCDate() < day) d.setUTCDate(0);
  return d.getTime();
}

export function dayStart(ymd) { return Date.parse(ymd + 'T00:00:00' + TZ); }
export function dayEnd(ymd) { return Date.parse(ymd + 'T23:59:59.999' + TZ); }

export function statusOf(l, now = Date.now()) {
  if (l.revoked) return 'revoked';
  if (l.activatedAt) return l.expiresAt && now > l.expiresAt ? 'expired' : 'active';
  if (l.end && now > l.end) return 'expired';
  return 'unused';
}

export async function getLicense(key) {
  const raw = await redis('GET', 'lic:' + key);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export async function saveLicense(l) {
  await redis('SET', 'lic:' + l.key, JSON.stringify(l));
}

export async function createLicense(l) {
  const ok = await redis('SET', 'lic:' + l.key, JSON.stringify(l), 'NX');
  if (ok !== 'OK') return false;
  await redis('ZADD', 'lics', String(l.createdAt), l.key);
  return true;
}

export async function listLicenses() {
  const keys = await redis('ZRANGE', 'lics', '0', '-1', 'REV');
  if (!keys || !keys.length) return [];
  const out = [];
  for (let i = 0; i < keys.length; i += 500) {
    const part = keys.slice(i, i + 500);
    const vals = await redis('MGET', ...part.map((k) => 'lic:' + k));
    vals.forEach((v) => { if (v) { try { out.push(JSON.parse(v)); } catch {} } });
  }
  return out;
}

export async function deleteLicense(key) {
  await pipeline([['DEL', 'lic:' + key], ['ZREM', 'lics', key], ['DEL', 'prog:' + key]]);
}

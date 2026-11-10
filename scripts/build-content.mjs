// Gera lib/content-data.js e data/pdf/*.bin (criptografados) a partir da pasta private/.
// Uso: CONTENT_KEY=... node scripts/build-content.mjs
// private/content.json  -> questões, aulas e links (NUNCA suba a pasta private/)
// private/pdf/<id>.pdf  -> PDFs das aulas
import { readFileSync, writeFileSync, readdirSync, mkdirSync, rmSync } from 'node:fs';
import { createCipheriv, randomBytes } from 'node:crypto';
import { gzipSync } from 'node:zlib';

const key = Buffer.from(process.env.CONTENT_KEY || '', 'base64');
if (key.length !== 32) { console.error('CONTENT_KEY precisa ter 32 bytes em base64.'); process.exit(1); }

function enc(buf) {
  const iv = randomBytes(12);
  const c = createCipheriv('aes-256-gcm', key, iv);
  const out = Buffer.concat([c.update(buf), c.final()]);
  return Buffer.concat([iv, c.getAuthTag(), out]);
}

const content = readFileSync('private/content.json');
const blob = enc(gzipSync(content)).toString('base64');
writeFileSync('lib/content-data.js', '// Conteúdo criptografado (AES-256-GCM). Gerado por scripts/build-content.mjs\nexport default "' + blob + '";\n');

rmSync('data/pdf', { recursive: true, force: true });
mkdirSync('data/pdf', { recursive: true });
for (const f of readdirSync('private/pdf')) {
  if (!f.endsWith('.pdf')) continue;
  writeFileSync('data/pdf/' + f.replace(/\.pdf$/, '.bin'), enc(readFileSync('private/pdf/' + f)));
}
console.log('ok');

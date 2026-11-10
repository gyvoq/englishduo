import { wrap, send } from '../lib/http.js';
import { rateLimit } from '../lib/redis.js';
import { student } from '../lib/session.js';
import { content, readPdf } from '../lib/content.js';

function slug(s) {
  return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'material';
}

export default wrap(async (req, res) => {
  if (req.method !== 'GET') return send(res, 405, { error: 'Método inválido.' });
  const st = await student(req, res);
  if (!st) return send(res, 401, { error: 'Entre com sua chave para baixar.' });
  if (!(await rateLimit('pdf:' + st.key + ':' + st.device, 40, 600))) return send(res, 429, { error: 'Muitos downloads em pouco tempo. Espere alguns minutos.' });
  const id = String((req.query && req.query.id) || '');
  const buf = readPdf(id);
  if (!buf) return send(res, 404, { error: 'Material não encontrado.' });
  const p = content().pdfs[id];
  const name = slug(p.lesson.title) + (p.name === 'Caderno de exercícios' ? '-exercicios' : '') + '.pdf';
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="' + name + '"');
  res.setHeader('Cache-Control', 'private, no-store');
  res.end(buf);
});

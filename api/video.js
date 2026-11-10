import { wrap, send } from '../lib/http.js';
import { rateLimit } from '../lib/redis.js';
import { student } from '../lib/session.js';
import { content, videoToken, readVideoToken } from '../lib/content.js';

function errorPage(res, msg) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end('<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width"><style>html,body{height:100%;margin:0}body{display:grid;place-items:center;background:#0D0D0D;color:#fff;font:600 15px system-ui,sans-serif;text-align:center;padding:20px}</style><p>' + msg + '</p>');
}

export default wrap(async (req, res) => {
  if (req.method !== 'GET') return send(res, 405, { error: 'Método inválido.' });
  const q = req.query || {};

  // 2) O iframe abre /api/video?t=... e é redirecionado para o player do Drive.
  if (q.t) {
    const tok = readVideoToken(q.t);
    const st = await student(req, res);
    if (!tok || !st || st.key !== tok.k || st.device !== tok.d) return errorPage(res, 'Sessão expirada. Volte e abra a aula de novo.');
    const l = content().lessons[tok.l];
    if (!l || !l.video) return errorPage(res, 'Falha ao carregar vídeo.');
    res.statusCode = 302;
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('Location', 'https://drive.google.com/file/d/' + encodeURIComponent(l.video) + '/preview');
    return res.end();
  }

  // 1) O app pede um endereço temporário para a aula.
  const st = await student(req, res);
  if (!st) return send(res, 401, { error: 'Entre com sua chave para assistir.' });
  if (!(await rateLimit('vid:' + st.key + ':' + st.device, 120, 600))) return send(res, 429, { error: 'Muitas aulas abertas em pouco tempo. Espere alguns minutos.' });
  const l = content().lessons[String(q.l || '')];
  if (!l) return send(res, 404, { error: 'Aula não encontrada.' });
  if (!l.video) return send(res, 200, { src: null });
  send(res, 200, { src: '/api/video?t=' + videoToken(l.id, st.key, st.device) });
});

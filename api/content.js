import { wrap, send } from '../lib/http.js';
import { student, meOf } from '../lib/session.js';
import { catalog } from '../lib/content.js';

export default wrap(async (req, res) => {
  if (req.method !== 'GET') return send(res, 405, { error: 'Método inválido.' });
  const st = await student(req, res);
  send(res, 200, { me: meOf(st), ...catalog(!!st) });
});

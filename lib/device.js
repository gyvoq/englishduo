// Reconhece o MESMO aparelho físico em navegadores diferentes (Chrome, Safari,
// Firefox, Samsung, aba anônima, cookies apagados...).
//
// Um site não tem acesso a um número de série do aparelho. O que dá para fazer é
// comparar sinais de HARDWARE que todos os navegadores do mesmo aparelho enxergam
// igual (sistema, resolução da tela, fuso, GPU, núcleos) e exigir que a rede
// também bata com uma rede em que aquele aparelho já foi visto. Sem a rede, dois
// celulares do mesmo modelo (ex.: dois iPhones iguais) seriam confundidos.

const OS = new Set(['ios', 'android', 'windows', 'mac', 'linux', 'chromeos', 'other']);
const TZ = /^[A-Za-z0-9_+\-/]{1,64}$/;
const NET_DAYS = 45; // redes vistas há mais tempo que isso não contam
const MAX_NETS = 6;

const int = (v, lo, hi) => {
  const n = Math.round(Number(v));
  return Number.isFinite(n) && n >= lo && n <= hi ? n : 0;
};

function gpuFamily(s) {
  s = String(s || '').toLowerCase();
  if (!s) return '';
  if (/adreno/.test(s)) return 'adreno';
  if (/mali/.test(s)) return 'mali';
  if (/powervr|img tec/.test(s)) return 'powervr';
  if (/xclipse/.test(s)) return 'xclipse';
  if (/apple|\bm[1-9]\b/.test(s)) return 'apple';
  if (/nvidia|geforce|quadro|rtx|gtx/.test(s)) return 'nvidia';
  if (/amd|radeon|\bati\b/.test(s)) return 'amd';
  if (/intel|iris|uhd|hd graphics/.test(s)) return 'intel';
  if (/qualcomm/.test(s)) return 'adreno';
  return '';
}

// Valida o que o navegador mandou. Retorna null se não der para usar.
export function cleanHw(x) {
  if (!x || typeof x !== 'object') return null;
  const os = OS.has(x.os) ? x.os : 'other';
  const sw = int(x.sw, 200, 20000), sh = int(x.sh, 200, 20000);
  const pw = int(x.pw, 200, 40000), ph = int(x.ph, 200, 40000);
  if (!(sw && sh) && !(pw && ph)) return null;
  const tz = typeof x.tz === 'string' && TZ.test(x.tz) ? x.tz : '';
  return {
    os, sw, sh, pw, ph, tz,
    cores: int(x.cores, 1, 512),
    gpu: gpuFamily(String(x.gpu || '').slice(0, 200))
  };
}

const near = (a, b, tol) => a && b && Math.abs(a - b) <= tol;

// Mesmo hardware? (não olha a rede)
export function sameHw(a, b) {
  if (!a || !b) return false;
  if (a.os !== b.os || a.os === 'other') return false;
  if (a.tz && b.tz && a.tz !== b.tz) return false;
  const css = near(a.sw, b.sw, 2) && near(a.sh, b.sh, 2);
  const phys = near(a.pw, b.pw, 4) && near(a.ph, b.ph, 4);
  if (!css && !phys) return false;
  // Safari mascara GPU e núcleos no Mac/iPhone, então lá esses dois não contam.
  const apple = a.os === 'mac' || a.os === 'ios';
  if (!apple && a.gpu && b.gpu && a.gpu !== b.gpu) return false;
  if (!apple && a.cores && b.cores && a.cores !== b.cores) return false;
  return true;
}

// Rede "aproximada": IPv4 /24 ou IPv6 /64. Navegadores do mesmo aparelho, na
// mesma hora, saem pela mesma rede.
export function netOf(ip) {
  ip = String(ip || '').trim().replace(/^::ffff:/i, '');
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(ip)) return ip.split('.').slice(0, 3).join('.');
  if (ip.includes(':')) {
    const [head, tail] = ip.split('::');
    const h = head ? head.split(':') : [];
    const t = tail !== undefined ? (tail ? tail.split(':') : []) : [];
    const full = tail !== undefined ? [...h, ...Array(Math.max(0, 8 - h.length - t.length)).fill('0'), ...t] : h;
    return full.slice(0, 4).map((p) => (parseInt(p, 16) || 0).toString(16)).join(':');
  }
  return '';
}

function knowsNet(m, net, now) {
  if (!net || !Array.isArray(m.nets)) return false;
  return m.nets.some((x) => x.n === net && now - x.t < NET_DAYS * 86400000);
}

// Procura entre os aparelhos da chave um que seja o mesmo hardware, na mesma rede.
// Só aceita se houver exatamente UM candidato (evita juntar dois aparelhos iguais).
export function findSameDevice(list, hw, ip, now = Date.now()) {
  if (!hw) return null;
  const net = netOf(ip);
  const hits = list.filter((m) => sameHw(m.hw, hw) && knowsNet(m, net, now));
  return hits.length === 1 ? hits[0] : null;
}

// Guarda hardware e rede no aluno. Retorna true se mudou algo (precisa salvar).
export function touchMember(m, hw, ip, now = Date.now()) {
  let changed = false;
  if (hw && JSON.stringify(m.hw || null) !== JSON.stringify(hw)) { m.hw = hw; changed = true; }
  const net = netOf(ip);
  if (net) {
    if (!Array.isArray(m.nets)) m.nets = [];
    const cur = m.nets.find((x) => x.n === net);
    // Só regrava a data se passou mais de 1 dia, para não escrever no banco toda hora.
    if (!cur) { m.nets.unshift({ n: net, t: now }); changed = true; }
    else if (now - cur.t > 86400000) { cur.t = now; changed = true; }
    if (changed) {
      m.nets = m.nets.filter((x) => now - x.t < NET_DAYS * 86400000).sort((a, b) => b.t - a.t).slice(0, MAX_NETS);
    }
  }
  return changed;
}

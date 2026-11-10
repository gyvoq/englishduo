// Filtro do chat: palavrões, ofensas, ameaças, links, contatos e chaves de acesso.

const LEET = { '0': 'o', '1': 'i', '3': 'e', '4': 'a', '5': 's', '7': 't', '8': 'b', '@': 'a', '$': 's', '!': 'i' };

function base(s) {
  return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[013457@$!8]/g, (c) => LEET[c] || c);
}
const squeeze = (w) => w.replace(/(.)\1+/g, '$1');

// Palavras inteiras (comparadas já sem acento e sem letras repetidas).
const WORDS = [
  // pt
  'porra', 'caralho', 'krl', 'crl', 'merda', 'puta', 'puto', 'putas', 'putos', 'putaria', 'putinha', 'vagabunda', 'vagabundo',
  'viado', 'viada', 'viadinho', 'bicha', 'bichinha', 'sapatao', 'buceta', 'boceta', 'xoxota', 'xereca', 'piroca', 
  'foder', 'fodase', 'foda', 'fodido', 'fodida', 'fode', 'fudido', 'fudida', 'fuder', 'cu', 'cuzao', 'cuzinho', 'arrombado', 'arrombada',
  'babaca', 'otario', 'otaria', 'idiota', 'imbecil', 'retardado', 'retardada', 'mongoloide', 'corno', 'chifrudo', 'desgracado', 'desgracada',
  'fdp', 'vsf', 'vtnc', 'tnc', 'tmnc', 'pqp', 'crioulo', 'vadia', 'piranha', 'escroto', 'escrota', 'punheta', 'punheteiro', 'siririca',
  'porno', 'cacete', 'bosta', 'safada', 'safado', 'kct',
  // en
  'fuck', 'fucking', 'fucker', 'fucked', 'motherfucker', 'shit', 'bullshit', 'bitch', 'bastard', 'ashole', 'dick', 'cock', 'pusy',
  'cunt', 'whore', 'slut', 'niga', 'fagot', 'fag', 'retard', 'wanker', 'twat', 'kys', 'stfu', 'wtf', 'porn', 'dumbas'
].map(squeeze);
const WORDSET = new Set(WORDS);

// Pedaços que denunciam a palavra mesmo dentro de outra (fuckkk, merdinha, caralhoo...).
const STEMS = ['fuck', 'caralh', 'buceta', 'arromb', 'putari', 'punhet', 'cuza', 'merdinh', 'fodas', 'bitch', 'motherf', 'xerec', 'xoxot', 'piroc'].map(squeeze);
const STEM_SAFE = [];

// Frases (ameaças / ataques).
const PHRASES = ['vai se matar', 'vou te matar', 'kill yourself', 'filho da puta', 'filha da puta', 'vai tomar no', 'tomar no cu']
  .map((p) => squeeze(base(p).replace(/[^a-z ]/g, '')));

export function checkMessage(text) {
  const raw = String(text);

  // links, e-mails, telefones e chaves
  if (/(https?:\/\/|www\.|\b[a-z0-9-]+\.(com|net|org|br|io|ly|me|app|link|site|xyz|gg|tv|co)\b|wa\.me|t\.me|bit\.ly|discord\.gg)/i.test(raw)) return 'Links não são permitidos no chat.';
  if (/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(raw)) return 'Não compartilhe e-mails no chat.';
  if ((raw.replace(/[^\d]/g, '').length >= 8) && /(\d[\s().-]*){8,}/.test(raw)) return 'Não compartilhe telefones ou números no chat.';
  if (/\bED[\s-]?[A-Z0-9]{4}[\s-]?[A-Z0-9]{4}/i.test(raw)) return 'Não compartilhe chaves de acesso.';

  const b = base(raw);
  const spaced = squeeze(b.replace(/[^a-z]+/g, ' ')).trim();
  // junta letras soltas: "p u t a" -> "puta"
  const joined = spaced.replace(/\b(?:[a-z] ){2,}[a-z]\b/g, (m) => m.replace(/ /g, ''));

  const tokens = joined.split(' ').filter(Boolean);
  for (const t of tokens) {
    if (WORDSET.has(t)) return 'Mensagem bloqueada: sem palavrões ou ofensas, por favor.';
    if (STEMS.some((s) => t.startsWith(s) || (s.length >= 5 && t.includes(s))) && !STEM_SAFE.some((x) => t.startsWith(x))) {
      return 'Mensagem bloqueada: sem palavrões ou ofensas, por favor.';
    }
  }
  const padded = ' ' + joined + ' ';
  if (PHRASES.some((p) => padded.includes(' ' + p))) return 'Mensagem bloqueada: sem ameaças ou ofensas, por favor.';

  // gritaria / flood
  const letters = raw.replace(/[^A-Za-zÀ-ÿ]/g, '');
  if (letters.length >= 16 && letters === letters.toUpperCase()) return 'Evite escrever tudo em maiúsculas.';
  if (/(.)\1{9,}/.test(raw)) return 'Mensagem parece spam.';
  return null;
}

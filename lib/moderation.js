// Filtro do chat e dos nomes: palavrões, ofensas, conteúdo sexual, ódio, ameaças,
// links, contatos, redes sociais, chaves de acesso e spam.

const LEET = { '0': 'o', '1': 'i', '2': 'z', '3': 'e', '4': 'a', '5': 's', '6': 'g', '7': 't', '8': 'b', '9': 'g', '@': 'a', '$': 's', '!': 'i', '|': 'i', '€': 'e', '£': 'l', '+': 't' };
// letras de outros alfabetos que parecem latinas (а, е, о, р, с, х, у, і...)
const LOOK = { 'а': 'a', 'е': 'e', 'о': 'o', 'р': 'p', 'с': 'c', 'х': 'x', 'у': 'y', 'і': 'i', 'ј': 'j', 'к': 'k', 'м': 'm', 'н': 'h', 'т': 't', 'в': 'b', 'ѕ': 's', 'ԁ': 'd', 'ɡ': 'g', 'ᴀ': 'a', 'ʀ': 'r' };

function base(s) {
  return String(s)
    .normalize('NFKC')
    .replace(/[​-‏⁠﻿­]/g, '')       // caracteres invisíveis
    .toLowerCase()
    .replace(/./gu, (c) => LOOK[c] || c)
    .normalize('NFD').replace(/[̀-ͯ]/g, '')         // acentos
    .replace(/[0-9@$!|€£+]/g, (c) => LEET[c] || c);
}
const squeeze = (w) => w.replace(/(.)\1+/g, '$1');

// Palavras que bloqueiam sempre (sem acento e com letras repetidas reduzidas a uma).
const WORDS = [
  // português — palavrões e xingamentos
  'porra', 'caralho', 'krl', 'crl', 'carai', 'caraio', 'merda', 'bosta', 'puta', 'puto', 'putas', 'putos', 'putinha', 'putaria', 'putero',
  'vagabunda', 'vagabundo', 'vadia', 'vadio', 'piranha', 'piriguete', 'rapariga', 'quenga', 'meretriz', 'prostituta',
  'foder', 'fodase', 'foda', 'fodas', 'fodido', 'fodida', 'fode', 'fodeu', 'fudeu', 'fudido', 'fudida', 'fuder', 'fudendo', 'fodendo',
  'cu', 'cuzao', 'cuzinho', 'cuzuda', 'arrombado', 'arrombada', 'escroto', 'escrota', 'babaca', 'otario', 'otaria', 'idiota', 'imbecil',
  'retardado', 'retardada', 'mongoloide', 'corno', 'corna', 'chifrudo', 'desgraca', 'desgracado', 'desgracada',
  'cacete', 'kct', 'pqp', 'fdp', 'vsf', 'vtnc', 'tnc', 'tmnc', 'vtmnc', 'pnc', 'safado', 'safada', 'canalha', 'escoria',
  // português — sexual
  'buceta', 'boceta', 'xoxota', 'xereca', 'xota', 'perereca', 'piroca', 'caceta', 'pirocudo', 'rabuda',
  'punheta', 'punheteiro', 'siririca', 'gozei', 'gozou', 'porno', 'porn', 'pornografia', 'sexo', 'transar', 'tesao', 'tesuda',
  'safadeza', 'nudes', 'nude', 'peladinha', 'boquete', 'mamada', 'chupar', 'chupeta', 'orgia', 'bundao', 'peituda', 'xvideos', 'onlyfans',
  // português — ódio / preconceito
  'viado', 'viada', 'viadinho', 'bicha', 'bichinha', 'boiola', 'baitola', 'sapatao', 'sapata', 'traveco',
  'crioulo', 'criola', 'tiziu', 'judeuzinho', 'nazista', 'nazi', 'hitler',
  // português — drogas / violência
  'maconha', 'cocaina', 'crack', 'baseado', 'beck', 'lanca', 'suicidio', 'suicida',
  // inglês
  'fuck', 'fucking', 'fucker', 'fucked', 'fck', 'fuk', 'motherfucker', 'shit', 'shitty', 'bullshit', 'bitch', 'bitches', 'bastard',
  'ashole', 'dick', 'dickhead', 'cock', 'pusy', 'cunt', 'whore', 'slut', 'niga', 'nigah', 'fagot', 'fag', 'dyke',
  'tranny', 'retard', 'retarded', 'wanker', 'twat', 'prick', 'jackas', 'dumbas', 'kys', 'stfu', 'gtfo', 'wtf', 'sexy',
  'boobs', 'tits', 'penis', 'vagina', 'cum', 'horny', 'blowjob', 'handjob', 'rape', 'rapist'
].map(squeeze);
const WORDSET = new Set(WORDS);

// Xingamentos que também são palavras comuns: só bloqueiam quando dirigidos a alguém (você/seu/te...).
const ATTACK = new Set(['lixo', 'verme', 'trouxa', 'palhaco', 'animal', 'jumento', 'anta', 'estupido', 'estupida', 'burro', 'burra', 'inutil',
  'nojento', 'nojenta', 'debil', 'demente', 'mongol', 'macaco', 'macaca', 'veado', 'jerk', 'loser', 'stupid', 'idiot', 'dumb', 'ugly',
  'feio', 'feia', 'gorda', 'gordo', 'retardado'].map(squeeze));

// Pedaços que denunciam a palavra mesmo dentro de outra (fuckkk, merdinha, caralhoo, putinhas...).
const STEMS = [
  'fuck', 'caralh', 'buceta', 'boceta', 'arromb', 'putari', 'punhet', 'cuza', 'merd', 'fodas', 'fodid', 'fudid', 'bitch', 'motherf',
  'xerec', 'xoxot', 'piroc', 'porno', 'viad', 'vagabund', 'desgrac', 'escrot', 'babac', 'otari', 'imbecil', 'idiot', 'retardad',
  'siriric', 'boquet', 'sapatao', 'travec', 'crioul', 'nazis', 'shit', 'cunt', 'whore', 'slut', 'niga', 'fagot', 'onlyfan', 'xvideo',
  'pornhub', 'cacet', 'safad', 'putinh', 'putona', 'putao', 'filhadaput', 'filhodaput'
].map(squeeze);
// palavras normais que contêm algum pedaço acima
const SAFE = ['merdeka', 'viaduto', 'viadutos', 'shitake', 'cacetinho', 'escrotal', 'idiotice', 'idioma', 'idiomas', 'idiomatic', 'idiomatica', 'idiomatico',
  'pornografico', 'computa', 'computador', 'computadores', 'disputa', 'disputar', 'reputa', 'reputacao', 'imputa', 'amputa', 'deputado', 'deputada',
  'otariano', 'notario', 'notaria', 'scunthorpe', 'cocktail', 'peacock', 'hancock', 'dickens', 'dickinson', 'class', 'pass', 'grass', 'glass', 'mass', 'bass', 'assist', 'assistir',
  'assim', 'assunto', 'massa', 'passar', 'sexta', 'sexto', 'sexteto', 'essex', 'sussex', 'anals', 'analise', 'analisar', 'analogia', 'canal', 'canais',
  'dieta', 'diet', 'diesel', 'killer', 'skill', 'skills', 'mato', 'pauta', 'paulo', 'paula', 'pausa', 'pauzinho', 'rolar', 'rolando', 'controla',
  'pintor', 'pintura', 'pintar', 'pica-pau', 'picar', 'animalzinho', 'macacao', 'drogaria', 'lancamento', 'lanche', 'lancar', 'matarana'];
const SAFESET = new Set(SAFE.map(squeeze));

// Frases (ameaças / ataques / assédio).
const PHRASES = [
  'vai se matar', 'vou te matar', 'te mato', 'vai morrer', 'kill yourself', 'kill urself', 'go die', 'filho da puta', 'filha da puta',
  'vai tomar no', 'tomar no cu', 'vai se foder', 'vai se fuder', 'vai pro inferno', 'cala a boca', 'cala boca', 'shut up', 'fuck you', 'fuck off',
  'son of a bitch', 'go to hell', 'manda nudes', 'manda foto', 'chama no privado', 'chama no pv', 'me chama no', 'meu numero', 'meu zap',
  'meu whats', 'meu insta', 'me segue', 'segue la', 'sigam', 'link na bio', 'ganhe dinheiro', 'renda extra', 'pix', 'compre agora', 'promocao'
].map((p) => squeeze(base(p).replace(/[^a-z ]/g, ' ').replace(/\s+/g, ' ').trim()));

// Contato / redes sociais (já em texto normalizado).
const CONTACT = ['whatsapp', 'wpp', 'zap', 'zapzap', 'telegram', 'insta', 'instagram', 'tiktok', 'discord', 'facebook', 'twitter',
  'snapchat', 'kwai', 'onlyfans', 'linktree', 'gmail', 'hotmail', 'outlook', 'pix', 'chavepix'].map(squeeze);

const MSG_BAD = 'Mensagem bloqueada: sem palavrões, ofensas ou conteúdo impróprio.';

function tokensOf(text) {
  const b = base(text);
  // tira separadores entre letras: p.u.t.a / p-u-t-a / p_u_t_a / p*u*t*a
  const glued = b.replace(/\b([a-z])(?:[\s.\-_*~'"`,;:/\\]+([a-z])\b)+/g, (m) => m.replace(/[^a-z]/g, ''));
  const spaced = squeeze(glued.replace(/[^a-z]+/g, ' ')).trim();
  return { spaced, tokens: spaced.split(' ').filter(Boolean), compact: squeeze(b.replace(/[^a-z]+/g, '')) };
}

function badWords(t) {
  const { spaced, tokens, compact } = t;
  for (const w of tokens) {
    if (SAFESET.has(w)) continue;
    if (WORDSET.has(w)) return true;
    if (STEMS.some((s) => (s.length >= 5 ? w.includes(s) : w.startsWith(s)))) return true;
  }
  // xingamento dirigido a alguém: "seu burro", "você é um lixo", "you are stupid"
  if (/\b(voce|vc|tu|seu|sua|te|teu|tua|you|your|ur|u|ele|ela|cara|mano)\b/.test(spaced) && tokens.some((w) => ATTACK.has(w))) return true;
  // texto todo grudado ("vaitomarnocu", "fdpdemerda")
  if (['vaitomarnocu', 'filhodaputa', 'filhadaputa', 'vaisefoder', 'vaisefuder', 'fuckyou', 'killyourself', 'tomarnocu', 'pauno', 'caralho', 'buceta', 'motherfucker']
    .map(squeeze).some((x) => compact.includes(x))) return true;
  const padded = ' ' + spaced + ' ';
  return PHRASES.some((p) => padded.includes(' ' + p + ' ') || padded.includes(' ' + p));
}

export function checkMessage(text) {
  const raw = String(text);

  // links, e-mails, telefones, @perfis e chaves
  if (/(https?:|www\s*\.|\b[a-z0-9-]+\.(com|net|org|br|io|ly|me|app|link|site|xyz|gg|tv|co|info|online|store|shop|vip|top|click)\b|\b(ponto|dot)\s*(com|br|net)\b|wa\.me|t\.me|bit\.ly)/i.test(raw)) return 'Links não são permitidos no chat.';
  if (/[a-z0-9._%+-]+\s*(@|\(at\)|\[at\]| arroba )\s*[a-z0-9.-]+\s*(\.|dot|ponto)\s*[a-z]{2,}/i.test(raw)) return 'Não compartilhe e-mails no chat.';
  if (raw.replace(/[^\d]/g, '').length >= 7) return 'Não compartilhe telefones ou números longos no chat.';
  if (/(^|\s)@[a-z0-9._]{3,}/i.test(raw)) return 'Não divulgue perfis no chat.';
  if (/\bED[\s-]*[A-Z0-9]{4}[\s-]*[A-Z0-9]{4}/i.test(raw)) return 'Não compartilhe chaves de acesso.';

  const t = tokensOf(raw);
  if (t.tokens.some((w) => CONTACT.includes(w))) return 'Não peça nem passe contatos ou redes sociais no chat.';
  if (badWords(t)) return MSG_BAD;

  // spam / gritaria
  const letters = raw.replace(/[^A-Za-zÀ-ÿ]/g, '');
  if (letters.length >= 12 && letters === letters.toUpperCase()) return 'Evite escrever tudo em maiúsculas.';
  if (/(.)\1{6,}/u.test(raw)) return 'Mensagem parece spam.';
  if (/(\b\w+\b)(\s+\1\b){3,}/i.test(raw)) return 'Mensagem parece spam.';
  const emojis = (raw.match(/\p{Extended_Pictographic}/gu) || []).length;
  if (emojis > 8) return 'Muitos emojis numa mensagem só.';
  if (letters.length < 2 && emojis === 0) return 'Escreva uma mensagem com texto.';
  return null;
}

// Nome do aluno: mesmas regras de ofensa, sem números, links ou contatos.
export function checkName(name) {
  const raw = String(name);
  if (!/^[\p{L}][\p{L}\s'.-]{1,39}$/u.test(raw)) return 'Use só letras no nome.';
  const t = tokensOf(raw);
  if (t.tokens.some((w) => CONTACT.includes(w))) return 'Escolha outro nome.';
  if (badWords(t) || t.tokens.some((w) => ATTACK.has(w))) return 'Escolha outro nome.';
  return null;
}

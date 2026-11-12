(function () {
  'use strict';

  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  var ST = {
    months: 1, devices: 1, qty: 1, custom: false, start: null, end: null,
    filter: 'all', search: '', list: [], shown: 50, created: [],
    cal: { start: null, end: null }
  };
  var PAGE = 50;
  var MONTHS = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  var STATUS = { active: ['Ativa', 'c-active'], unused: ['Não usada', 'c-unused'], expired: ['Expirada', 'c-expired'], revoked: ['Revogada', 'c-revoked'] };

  function api(action, data) {
    var body = Object.assign({ action: action }, data || {});
    return fetch('/api/admin', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      .then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (j) {
          if (!r.ok) { var e = new Error(j.error || 'Erro. Tente de novo.'); e.status = r.status; throw e; }
          return j;
        });
      }, function () { throw new Error('Sem conexão.'); });
  }
  function guard(e) {
    if (e.status === 401 && action401) { showLogin(); toast('Sessão expirada. Entre de novo.'); return true; }
    toast(e.message); return false;
  }
  var action401 = true;

  var toastT;
  function toast(msg) {
    var t = $('#toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove('show'); }, 2600);
  }
  function busy(btn, on, label) {
    if (!btn) return;
    if (on) { btn.dataset.label = btn.innerHTML; btn.innerHTML = '<span class="spin"></span>' + (label || 'Aguarde…'); btn.classList.add('loading'); btn.disabled = true; }
    else { if (btn.dataset.label) btn.innerHTML = btn.dataset.label; btn.classList.remove('loading'); btn.disabled = false; }
  }

  function fmt(ts) {
    if (!ts) return '—';
    try { return new Date(ts).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }); } catch (e) { return '—'; }
  }
  function fmtTime(ts) {
    try { return new Date(ts).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }); } catch (e) { return ''; }
  }
  function ymd(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function ymdLabel(s) { var p = s.split('-'); return p[2] + '/' + p[1] + '/' + p[0]; }

  // ---------- login ----------
  function showLogin() {
    $('#main').style.display = 'none';
    $('#login-screen').style.display = 'flex';
    setTimeout(function () { $('#secret-input').focus(); }, 30);
  }
  function showMain() {
    $('#login-screen').style.display = 'none';
    $('#main').style.display = 'block';
  }

  var H = {};
  H.noop = function () {};

  H.doLogin = function () {
    var inp = $('#secret-input'), err = $('#login-error'), btn = $('.login-card .btn-primary');
    err.textContent = '';
    if (!inp.value) { err.textContent = 'Digite a senha.'; return; }
    busy(btn, true, 'Entrando…');
    api('login', { password: inp.value }).then(function () {
      inp.value = '';
      showMain();
      H.loadLicenses();
      H.loadChat();
    }).catch(function (e) { err.textContent = e.message; }).then(function () { busy(btn, false); });
  };
  H.doLogout = function () {
    api('logout').catch(function () {}).then(function () { ST.list = []; renderTable(); showLogin(); });
  };

  // ---------- dropdowns / calendário ----------
  function closeAll(except) {
    $$('.dd.open').forEach(function (d) { if (d !== except) d.classList.remove('open'); });
  }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeAll(); H.closeConfirm(); H.closeLogs(); } });

  H.toggleDD = function (el) {
    var dd = el.closest('.dd');
    var open = !dd.classList.contains('open');
    closeAll(dd);
    dd.classList.toggle('open', open);
  };
  function pick(el, labelSel) {
    var menu = el.closest('.dd-menu');
    $$('.dd-item', menu).forEach(function (i) { i.classList.toggle('active', i === el); });
    $(labelSel).textContent = el.textContent;
    el.closest('.dd').classList.remove('open');
  }
  H.pickValidity = function (el, n) { ST.months = n; pick(el, '#validity-label'); };
  H.pickDevices = function (el, n) { ST.devices = n; pick(el, '#devices-label'); };

  H.changeQty = function (d) {
    ST.qty = Math.min(50, Math.max(1, ST.qty + d));
    $('#qty-display').textContent = ST.qty;
  };

  H.onDateModeChange = function (el) {
    ST.custom = el.checked;
    $('#custom-dates').classList.toggle('visible', ST.custom);
    $('#validity-field').classList.toggle('hidden', ST.custom);
  };

  H.openCal = function (which, el) {
    var dd = el.closest('.dd');
    var open = !dd.classList.contains('open');
    closeAll(dd);
    if (!open) { dd.classList.remove('open'); return; }
    var base = ST[which] ? new Date(ST[which] + 'T12:00:00') : (which === 'end' && ST.start ? new Date(ST.start + 'T12:00:00') : new Date());
    ST.cal[which] = { y: base.getFullYear(), m: base.getMonth() };
    renderCal(which);
    dd.classList.add('open');
  };
  H.calNav = function (which, d) {
    var c = ST.cal[which];
    c.m += d;
    if (c.m < 0) { c.m = 11; c.y--; }
    if (c.m > 11) { c.m = 0; c.y++; }
    renderCal(which);
  };
  H.pickDay = function (which, s) {
    ST[which] = s;
    var lbl = $('#label-' + which);
    lbl.textContent = ymdLabel(s);
    lbl.classList.remove('ph');
    if (which === 'start' && ST.end && ST.end < s) { ST.end = null; $('#label-end').textContent = 'Selecionar'; $('#label-end').classList.add('ph'); }
    closeAll();
  };
  function renderCal(which) {
    var c = ST.cal[which], box = $('#cal-' + which);
    var first = new Date(c.y, c.m, 1), days = new Date(c.y, c.m + 1, 0).getDate();
    var today = ymd(new Date());
    var min = which === 'end' ? (ST.start || today) : today;
    var h = '<div class="cal-head"><button type="button" class="cal-nav" data-click="calNav" data-args=\'["' + which + '",-1]\' aria-label="Mês anterior">‹</button>' +
      '<span>' + MONTHS[c.m] + ' ' + c.y + '</span>' +
      '<button type="button" class="cal-nav" data-click="calNav" data-args=\'["' + which + '",1]\' aria-label="Próximo mês">›</button></div>' +
      '<div class="cal-week"><span>D</span><span>S</span><span>T</span><span>Q</span><span>Q</span><span>S</span><span>S</span></div><div class="cal-grid">';
    for (var i = 0; i < first.getDay(); i++) h += '<span></span>';
    for (var d = 1; d <= days; d++) {
      var s = c.y + '-' + String(c.m + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
      var cls = 'day' + (s === today ? ' today' : '') + (s === ST[which] ? ' sel' : '');
      h += '<button type="button" class="' + cls + '"' + (s < min ? ' disabled' : '') + ' data-click="pickDay" data-args=\'["' + which + '","' + s + '"]\'>' + d + '</button>';
    }
    box.innerHTML = h + '</div>';
  }

  // ---------- criar ----------
  H.createLicenses = function () {
    var btn = $('#create-btn');
    var data = { devices: ST.devices, qty: ST.qty, desc: $('#desc-input').value.trim() };
    if (ST.custom) {
      if (!ST.start || !ST.end) { toast('Escolha as datas de início e fim.'); return; }
      data.start = ST.start; data.end = ST.end;
    } else data.months = ST.months;
    busy(btn, true, 'Criando…');
    api('create', data).then(function (r) {
      ST.created = r.keys || [];
      $('#created-title').textContent = ST.created.length === 1 ? '1 licença criada' : ST.created.length + ' licenças criadas';
      $('#keys-list').innerHTML = ST.created.map(function (k) {
        return '<button type="button" class="key-chip" data-click="copyKey" data-args=\'["' + esc(k) + '"]\' title="Copiar">' + esc(k) + '</button>';
      }).join('');
      $('#created-keys-box').style.display = 'block';
      $('#desc-input').value = '';
      toast(ST.created.length === 1 ? 'Licença criada.' : 'Licenças criadas.');
      H.loadLicenses();
    }).catch(guard).then(function () { busy(btn, false); });
  };

  function copy(text, msg) {
    var done = function () { toast(msg || 'Copiado.'); };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text); done(); });
    } else { fallbackCopy(text); done(); }
  }
  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    ta.remove();
  }
  H.copyAllKeys = function () { if (ST.created.length) copy(ST.created.join('\n'), 'Chaves copiadas.'); };
  H.copyKey = function (k) { copy(k, 'Chave copiada.'); };

  // ---------- lista ----------
  H.loadLicenses = function () {
    var tb = $('#licenses-tbody');
    if (!ST.list.length) tb.innerHTML = '<tr><td colspan="6" class="empty"><span class="spin"></span>Carregando…</td></tr>';
    var btn = $('.search-row .icon-btn');
    busy(btn, true, '');
    return api('list').then(function (r) {
      ST.list = r.licenses || [];
      renderTable();
    }).catch(function (e) {
      if (!guard(e)) tb.innerHTML = '<tr><td colspan="6" class="empty">' + esc(e.message) + '</td></tr>';
    }).then(function () { busy(btn, false); });
  };

  H.setFilter = function (f, el) {
    ST.filter = f; ST.shown = PAGE;
    $$('#tabs .tab').forEach(function (t) { t.classList.toggle('active', t === el); });
    renderTable();
  };
  var searchT;
  H.onSearchInput = function () {
    clearTimeout(searchT);
    searchT = setTimeout(function () { ST.search = $('#search-input').value.trim().toLowerCase(); ST.shown = PAGE; renderTable(); }, 150);
  };
  H.showMore = function () { ST.shown += PAGE; renderTable(); };

  function filtered() {
    var q = ST.search;
    return ST.list.filter(function (l) {
      if (ST.filter !== 'all' && l.status !== ST.filter) return false;
      if (!q) return true;
      return (l.key + ' ' + l.desc + ' ' + l.names.join(' ')).toLowerCase().indexOf(q) !== -1;
    });
  }

  function validityText(l) {
    if (l.months) return l.months === 1 ? '1 mês' : l.months + ' meses';
    if (l.start && l.end) return fmt(l.start) + ' a ' + fmt(l.end);
    return '';
  }

  function rowHTML(l) {
    var st = STATUS[l.status] || ['—', ''];
    var k = esc(l.key);
    var acts = '<button class="act act-copy" data-click="copyKey" data-args=\'["' + k + '"]\'>Copiar</button>';
    if (l.status !== 'revoked') acts += '<button class="act act-revoke" data-click="askRevoke" data-args=\'["' + k + '"]\'>Revogar</button>';
    if (l.status !== 'unused' || l.used > 0) acts += '<button class="act act-reset" data-click="openLogs" data-args=\'["' + k + '"]\'>Registros</button>';
    if (l.used > 0) acts += '<button class="act act-reset" data-click="askReset" data-args=\'["' + k + '"]\'>Aparelhos</button>';
    acts += '<button class="act act-delete" data-click="askDelete" data-args=\'["' + k + '"]\'>Excluir</button>';
    var exp = l.expiresAt ? fmt(l.expiresAt) : (l.status === 'unused' ? (l.end ? fmt(l.end) : validityText(l) + ' após ativar') : '—');
    return '<tr>' +
      '<td class="td-key"><span class="key-cell">' + k + '</span>' + (l.desc ? '<span class="desc">' + esc(l.desc) + '</span>' : '') + '<span class="sub" title="Criada em ' + fmt(l.createdAt) + '">' + esc(validityText(l)) + '</span></td>' +
      '<td class="td-aluno who"><span class="td-label">' + (l.devices > 1 ? 'Alunos' : 'Aluno') + '</span>' + (l.names.length ? '<span class="names">' + l.names.map(function (n) { return '<span class="nm">' + esc(n) + '</span>'; }).join('') + '</span>' : '<span style="color:var(--muted)">—</span>') + '<span class="sub">' + l.used + '/' + l.devices + ' ' + (l.devices === 1 ? 'aparelho' : 'aparelhos') + '</span></td>' +
      '<td class="td-status"><span class="status ' + st[1] + '"><span class="dot"></span>' + st[0] + '</span></td>' +
      '<td class="td-ativ"><span class="td-label">Ativada</span><span class="date-cell">' + fmt(l.activatedAt) + '</span></td>' +
      '<td class="td-exp"><span class="td-label">Expira</span><span class="date-cell">' + esc(exp) + '</span></td>' +
      '<td class="td-actions"><div class="actions">' + acts + '</div></td></tr>';
  }

  function renderTable() {
    var counts = { all: ST.list.length, active: 0, unused: 0, expired: 0, revoked: 0 };
    ST.list.forEach(function (l) { counts[l.status] = (counts[l.status] || 0) + 1; });
    Object.keys(counts).forEach(function (k) { var el = $('#n-' + k); if (el) el.textContent = counts[k]; });
    var rows = filtered();
    var tb = $('#licenses-tbody');
    if (!rows.length) {
      tb.innerHTML = '<tr><td colspan="6" class="empty">' + (ST.list.length ? 'Nenhuma licença encontrada.' : 'Nenhuma licença criada ainda.') + '</td></tr>';
    } else {
      tb.innerHTML = rows.slice(0, ST.shown).map(rowHTML).join('');
    }
    var rest = rows.length - ST.shown;
    $('#more-wrap').classList.toggle('show', rest > 0);
    if (rest > 0) $('#more-btn').textContent = 'Mostrar mais (' + rest + ')';
  }

  // ---------- confirmação ----------
  var pending = null;
  function confirmBox(title, msg, okLabel, kind, fn) {
    $('#confirm-title').textContent = title;
    $('#confirm-msg').innerHTML = msg;
    var ok = $('#confirm-ok');
    ok.textContent = okLabel;
    ok.className = 'btn-confirm' + (kind ? ' ' + kind : '');
    pending = fn;
    $('#confirm-modal').classList.add('open');
    setTimeout(function () { ok.focus(); }, 30);
  }
  H.closeConfirm = function () { $('#confirm-modal').classList.remove('open'); pending = null; };
  $('#confirm-ok').addEventListener('click', function () {
    if (!pending) return;
    var fn = pending, btn = $('#confirm-ok');
    busy(btn, true, 'Aguarde…');
    fn().then(function () { H.closeConfirm(); return H.loadLicenses(); }).catch(guard).then(function () { busy(btn, false); });
  });
  $('#confirm-modal').addEventListener('click', function (e) { if (e.target.id === 'confirm-modal') H.closeConfirm(); });

  H.askRevoke = function (k) {
    confirmBox('Revogar licença?', 'A chave <strong>' + esc(k) + '</strong> deixa de funcionar na hora, em todos os aparelhos.', 'Revogar', 'warn', function () {
      return api('revoke', { key: k }).then(function () { toast('Licença revogada.'); });
    });
  };
  H.askReset = function (k) {
    confirmBox('Liberar aparelhos?', 'Todos os aparelhos e nomes da chave <strong>' + esc(k) + '</strong> serão removidos e as vagas liberadas. Quem tiver a chave pode entrar de novo.', 'Liberar', '', function () {
      return api('resetDevices', { key: k }).then(function () { toast('Aparelhos liberados.'); });
    });
  };
  H.askDelete = function (k) {
    confirmBox('Excluir licença?', 'A chave <strong>' + esc(k) + '</strong> e o progresso do aluno serão apagados. Não dá para desfazer.', 'Excluir', 'danger', function () {
      return api('delete', { key: k }).then(function () { toast('Licença excluída.'); });
    });
  };

  // ---------- registros de uso ----------
  var EV = {
    login: ['Entrou', 'ok'], access: ['Acessou', ''], logout: ['Saiu', ''],
    limit: ['Bloqueado: limite de aparelhos', 'bad'], denied: ['Bloqueado', 'bad'],
    revoke: ['Chave revogada (admin)', 'bad'], reset: ['Aparelhos liberados (admin)', '']
  };
  function netOf(ip) {
    ip = String(ip || '');
    if (/^\d+\.\d+\.\d+\.\d+$/.test(ip)) return ip.split('.').slice(0, 3).join('.');
    return ip.split(':').slice(0, 4).join(':');
  }
  function logsSummary(logs) {
    var since = Date.now() - 30 * 86400000, nets = {}, uas = {}, devs = {}, blocked = 0;
    logs.forEach(function (e) {
      if (e.t < since) return;
      if (e.ip && e.ev !== 'limit' && e.ev !== 'denied') nets[netOf(e.ip)] = 1;
      if (e.ua && (e.ev === 'login' || e.ev === 'access')) uas[e.ua] = 1;
      if (e.d && (e.ev === 'login' || e.ev === 'access')) devs[e.d] = 1;
      if (e.ev === 'limit') blocked++;
    });
    var n = Object.keys(nets).length, u = Object.keys(uas).length, d = Object.keys(devs).length;
    var warn = n >= 5 || blocked >= 3;
    return '<div class="log-sum' + (warn ? ' warn' : '') + '">' +
      '<b>Últimos 30 dias:</b> ' + d + ' ' + (d === 1 ? 'aparelho' : 'aparelhos') + ' · ' + n + ' ' + (n === 1 ? 'rede' : 'redes') + ' · ' + u + ' ' + (u === 1 ? 'navegador' : 'navegadores') + ' · ' + blocked + ' ' + (blocked === 1 ? 'bloqueio' : 'bloqueios') +
      (warn ? '<br><span>Muitas redes ou bloqueios: pode ser chave compartilhada.</span>' : '') + '</div>';
  }
  H.openLogs = function (k) {
    var box = $('#logs-list');
    $('#logs-title').textContent = 'Registros · ' + k;
    box.innerHTML = '<div class="empty"><span class="spin"></span>Carregando…</div>';
    $('#logs-modal').classList.add('open');
    api('logs', { key: k }).then(function (r) {
      var logs = r.logs || [], cur = r.current || {};
      if (!logs.length) { box.innerHTML = '<div class="empty">Nenhum registro ainda. Os registros começam a partir desta atualização.</div>'; return; }
      box.innerHTML = logsSummary(logs) + logs.map(function (e) {
        var ev = EV[e.ev] || [e.ev, ''];
        var who = e.n || (e.d && cur[e.d]) || '';
        var det = [];
        if (e.how) det.push(e.how);
        if (e.why) det.push(e.why);
        if (e.d) det.push(e.ev === 'limit' ? 'aparelho não cadastrado' : 'aparelho #' + e.d + (cur[e.d] ? '' : ' (removido)'));
        if (e.ua) det.push(e.ua);
        if (e.ip) det.push('IP ' + e.ip);
        return '<div class="log-row"><time>' + fmtTime(e.t) + '</time><div><span class="log-ev ' + ev[1] + '">' + esc(ev[0]) + '</span>' +
          (who ? ' <b>' + esc(who) + '</b>' : '') + '<p>' + esc(det.join(' · ')) + '</p></div></div>';
      }).join('');
    }).catch(function (e) { if (!guard(e)) box.innerHTML = '<div class="empty">' + esc(e.message) + '</div>'; });
  };
  H.closeLogs = function () { $('#logs-modal').classList.remove('open'); };
  $('#logs-modal').addEventListener('click', function (e) { if (e.target.id === 'logs-modal') H.closeLogs(); });

  // ---------- chat ----------
  H.loadChat = function () {
    var box = $('#chat-list');
    box.innerHTML = '<div class="empty"><span class="spin"></span>Carregando…</div>';
    api('chatList').then(function (r) {
      var msgs = r.msgs || [];
      box.innerHTML = msgs.length ? msgs.map(function (m) {
        return '<div class="chat-row"><div class="cm"><b>' + esc(m.n) + '</b><time>' + fmtTime(m.ts) + '</time><span class="lt">' + esc(m.lt) + '</span><p>' + esc(m.t) + '</p></div>' +
          '<button class="act act-delete" data-click="delMsg" data-args=\'["' + esc(m.l) + '","' + esc(m.id) + '","$el"]\'>Apagar</button></div>';
      }).join('') : '<div class="empty">Nenhuma mensagem nas aulas.</div>';
    }).catch(function (e) { if (!guard(e)) box.innerHTML = '<div class="empty">' + esc(e.message) + '</div>'; });
  };
  H.delMsg = function (l, id, el) {
    busy(el, true, '');
    api('chatDelete', { l: l, id: id }).then(function () {
      var row = el.closest('.chat-row'); if (row) row.remove();
      toast('Mensagem apagada.');
    }).catch(function (e) { busy(el, false); guard(e); });
  };

  // ---------- delegação ----------
  function args(el) {
    var raw = el.getAttribute('data-args');
    if (!raw) return [];
    try { return JSON.parse(raw).map(function (a) { return a === '$el' ? el : a; }); } catch (e) { return []; }
  }
  document.addEventListener('click', function (e) {
    var dd = e.target.closest('.dd'), inside = !!dd && e.target !== dd;
    var el = e.target.closest('[data-click]');
    if (el) {
      var fn = H[el.getAttribute('data-click')];
      if (fn) fn.apply(null, args(el));
    }
    if (!inside) closeAll();
  });
  document.addEventListener('change', function (e) {
    var el = e.target.closest('[data-change]');
    if (el && H[el.getAttribute('data-change')]) H[el.getAttribute('data-change')].apply(null, args(el));
  });
  document.addEventListener('input', function (e) {
    var el = e.target.closest('[data-input]');
    if (el && H[el.getAttribute('data-input')]) H[el.getAttribute('data-input')].apply(null, args(el));
  });
  $('#secret-input').addEventListener('keydown', function (e) { if (e.key === 'Enter') H.doLogin(); });

  // ---------- início: já logado? ----------
  $('#login-screen').style.display = 'none';
  api('list').then(function (r) {
    showMain();
    ST.list = r.licenses || [];
    renderTable();
    H.loadChat();
  }).catch(function (e) {
    if (e.status === 401) showLogin();
    else { showLogin(); $('#login-error').textContent = e.message; }
  });
})();

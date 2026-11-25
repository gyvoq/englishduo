(function () {
  var f = document.getElementById('f'), err = document.getElementById('err');
  f.addEventListener('submit', function (e) {
    e.preventDefault();
    err.style.display = 'none';
    var btn = f.querySelector('button'); btn.disabled = true; btn.textContent = 'Buscando...';
    fetch('/api/cakto?claim=1', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: document.getElementById('em').value, cpf: document.getElementById('cpf').value })
    }).then(function (r) { return r.json().then(function (j) { if (!r.ok) throw new Error(j.error || 'Erro. Tente de novo.'); return j; }); })
      .then(function (j) {
        f.hidden = true;
        document.getElementById('code').textContent = j.key;
        document.getElementById('go').href = '/?chave=' + encodeURIComponent(j.key);
        document.getElementById('ok').hidden = false;
      })
      .catch(function (e) { err.textContent = e.message; err.style.display = 'block'; })
      .then(function () { btn.disabled = false; btn.textContent = 'Ver meu código'; });
  });
  document.getElementById('copy').addEventListener('click', function () {
    var b = this, t = document.getElementById('code').textContent;
    if (navigator.clipboard) navigator.clipboard.writeText(t).then(function () { b.textContent = 'Copiado!'; setTimeout(function () { b.textContent = 'Copiar código'; }, 2000); });
  });
})();

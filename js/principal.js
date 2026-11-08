// Comportamento da página. Todo o conteúdo é legível sem este arquivo.
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var calmo = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var seta = function (d) { return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + (d < 0 ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7') + '"/></svg>'; };

  var ano = $('#ano');
  if (ano) ano.textContent = String(new Date().getFullYear());

  /* ---------- palco da chegada: alterna os trabalhos ---------- */
  var palco = $('[data-palco]');
  if (palco) {
    var cenas = $$('.palco__cena', palco);
    var legenda = $('[data-palco-legenda]', palco);
    var atualCena = 0;
    var timer = null;
    var seletor = document.createElement('span');
    seletor.className = 'palco__seletor';
    cenas.forEach(function (c, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', 'Mostrar ' + c.dataset.legenda.split(' · ')[0]);
      b.addEventListener('click', function () { parar(); mostrarCena(i); });
      seletor.appendChild(b);
    });
    legenda.parentNode.insertBefore(seletor, legenda.parentNode.firstChild);
    var botoesCena = $$('button', seletor);

    var mostrarCena = function (i) {
      atualCena = i;
      cenas.forEach(function (c, n) {
        c.classList.toggle('atual', n === i);
        if (n === i) c.removeAttribute('aria-hidden'); else c.setAttribute('aria-hidden', 'true');
      });
      botoesCena.forEach(function (b, n) { b.setAttribute('aria-pressed', String(n === i)); });
      legenda.textContent = cenas[i].dataset.legenda;
    };
    var parar = function () { clearInterval(timer); timer = null; };
    // troca automática só para quem não pediu menos movimento; para ao passar o mouse, focar ou escolher
    if (!calmo) timer = setInterval(function () { mostrarCena((atualCena + 1) % cenas.length); }, 5200);
    palco.addEventListener('mouseenter', parar);
    palco.addEventListener('focusin', parar);
    mostrarCena(0);
  }

  /* ---------- botão de voltar ---------- */
  var voltar = $('#voltar');
  var chegada = $('#inicio');
  if (voltar && chegada && 'IntersectionObserver' in window) {
    voltar.inert = true;
    new IntersectionObserver(function (e) {
      var mostrar = !e[0].isIntersecting;
      voltar.classList.toggle('visivel', mostrar);
      voltar.inert = !mostrar;
    }, { rootMargin: '-60% 0px 0px 0px' }).observe(chegada);
  }

  /* ---------- chave da última seção visitada ---------- */
  var chaves = $$('.chave');
  var marcarChave = function (id) {
    chaves.forEach(function (c) {
      if (c.dataset.secao === id) c.setAttribute('data-escolhida', ''); else c.removeAttribute('data-escolhida');
    });
  };
  chaves.forEach(function (c) { c.addEventListener('click', function () { marcarChave(c.dataset.secao); }); });
  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) { if (e.isIntersecting) marcarChave(e.target.id); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['trabalhos', 'processo', 'sobre', 'contato'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) obs.observe(el);
    });
  }

  /* ---------- pedido de horário: um passo por vez ---------- */
  $$('[data-sequencia]').forEach(function (seq) {
    var passos = $$('.passo', seq);
    var nome = $('[data-sequencia-nome]', seq.closest('figure'));
    var i = 0;
    var controles = document.createElement('div');
    controles.className = 'sequencia__controles';
    controles.innerHTML =
      '<button type="button" class="botao-redondo" data-dir="-1" aria-label="Passo anterior">' + seta(-1) + '</button>' +
      '<button type="button" class="botao-redondo" data-dir="1" aria-label="Próximo passo">' + seta(1) + '</button>' +
      '<div class="sequencia__pontos" role="group" aria-label="Escolher passo"></div>';
    seq.insertBefore(controles, seq.firstChild);
    var ant = $('[data-dir="-1"]', controles);
    var prox = $('[data-dir="1"]', controles);
    var pontos = $('.sequencia__pontos', controles);
    passos.forEach(function (p, k) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', 'Passo ' + (k + 1) + ': ' + p.dataset.titulo);
      b.addEventListener('click', function () { mostrar(k); });
      pontos.appendChild(b);
    });
    var botoes = $$('button', pontos);
    function mostrar(k) {
      i = Math.max(0, Math.min(passos.length - 1, k));
      passos.forEach(function (p, n) {
        p.classList.toggle('atual', n === i);
        if (n === i) p.removeAttribute('aria-hidden'); else p.setAttribute('aria-hidden', 'true');
      });
      botoes.forEach(function (b, n) { if (n === i) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current'); });
      ant.disabled = i === 0;
      prox.disabled = i === passos.length - 1;
      if (nome) nome.textContent = passos[i].dataset.titulo;
    }
    ant.addEventListener('click', function () { mostrar(i - 1); if (ant.disabled) prox.focus(); });
    prox.addEventListener('click', function () { mostrar(i + 1); if (prox.disabled) ant.focus(); });
    mostrar(0);
  });

  /* ---------- seletor da Maré: troca a captura e o frasco ---------- */
  $$('[data-escala]').forEach(function (escala) {
    var entrada = $('input[type="range"]', escala);
    var estados = $$('.estado', escala);
    var nome = $('[data-escala-nome]', escala.closest('figure'));
    var frascos = $$('[data-frascos] img', escala.closest('.mosaico'));
    function mostrar() {
      var v = Number(entrada.value);
      estados.forEach(function (e, n) {
        e.classList.toggle('atual', n === v);
        if (n === v) e.removeAttribute('aria-hidden'); else e.setAttribute('aria-hidden', 'true');
      });
      frascos.forEach(function (f, n) { f.classList.toggle('atual', n === v); });
      entrada.setAttribute('aria-valuetext', estados[v].dataset.nome);
      if (nome) nome.textContent = estados[v].dataset.nome;
    }
    entrada.addEventListener('input', mostrar);
    mostrar();
  });

  /* ---------- contato (js/dados.js) ---------- */
  var canal = $('#canal');
  var c = (window.PORTFOLIO && window.PORTFOLIO.contato) || {};
  var msg = c.mensagem || '';
  var numero = String(c.whatsapp || '').replace(/\D/g, '');
  var email = String(c.email || '').trim();
  var insta = String(c.instagram || '').replace(/^@/, '').trim();
  var link = null;
  if (numero) link = { href: 'https://wa.me/' + numero + (msg ? '?text=' + encodeURIComponent(msg) : ''), texto: 'Conversar pelo WhatsApp', externo: true, alternativa: email };
  else if (email) link = { href: 'mailto:' + email + (msg ? '?body=' + encodeURIComponent(msg) : ''), texto: 'Escrever um e-mail' };
  else if (insta) link = { href: 'https://instagram.com/' + encodeURIComponent(insta), texto: 'Mensagem no Instagram', externo: true };

  if (canal && link) {
    var a = document.createElement('a');
    a.className = 'canal';
    a.href = link.href;
    a.textContent = link.texto;
    if (link.externo) {
      a.target = '_blank'; a.rel = 'noopener';
      var s = document.createElement('span'); s.className = 'sr'; s.textContent = ' (abre em nova aba)'; a.appendChild(s);
    }
    canal.appendChild(a);
    if (link.alternativa) {
      var alt = document.createElement('span');
      alt.className = 'canal__alternativa';
      alt.appendChild(document.createTextNode('ou '));
      var m = document.createElement('a');
      m.href = 'mailto:' + link.alternativa;
      m.textContent = link.alternativa;
      alt.appendChild(m);
      canal.appendChild(alt);
    }
    canal.hidden = false;
  }
})();

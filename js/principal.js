// Comportamento da página. O conteúdo é legível sem este arquivo;
// aqui ficam apenas a barra guia, a chave escolhida, as sequências e o contato.
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- ano no rodapé ---------- */
  var ano = $('#ano');
  if (ano) ano.textContent = String(new Date().getFullYear());

  /* ---------- barra guia: aparece quando a chegada sai da tela ---------- */
  var guia = $('#guia');
  var chegada = $('#inicio');
  if (guia && chegada && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entradas) {
      var mostrar = !entradas[0].isIntersecting;
      guia.classList.toggle('visivel', mostrar);
      // escondida, a barra sai da ordem do teclado: o porta-chaves já cumpre esse papel
      guia.inert = !mostrar;
      if (mostrar) guia.removeAttribute('aria-hidden'); else guia.setAttribute('aria-hidden', 'true');
    }, { rootMargin: '-40% 0px 0px 0px' }).observe(chegada);
  } else if (guia) {
    guia.classList.add('visivel');
  }

  /* ---------- seção atual na barra e chave escolhida no porta-chaves ---------- */
  var linksGuia = $$('.guia__nav a');
  var chaves = $$('.chave');
  var secoes = ['trabalhos', 'processo', 'sobre', 'conversa']
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  function marcarChave(id) {
    chaves.forEach(function (c) {
      if (c.dataset.secao === id) c.setAttribute('data-escolhida', '');
      else c.removeAttribute('data-escolhida');
    });
  }
  chaves.forEach(function (c) {
    c.addEventListener('click', function () { marcarChave(c.dataset.secao); });
  });

  if ('IntersectionObserver' in window) {
    var visiveis = {};
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) { visiveis[e.target.id] = e.isIntersecting; });
      var atual = '';
      secoes.forEach(function (s) { if (visiveis[s.id]) atual = s.id; });
      linksGuia.forEach(function (a) {
        if (a.dataset.secao === atual) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
      // a chave acompanha a última seção visitada, para quem volta ao início
      if (atual) marcarChave(atual);
    }, { rootMargin: '-45% 0px -50% 0px' });
    secoes.forEach(function (s) { obs.observe(s); });
  }

  /* ---------- sequência de passos (um por vez, com anterior e próximo) ---------- */
  $$('[data-sequencia]').forEach(function (seq) {
    var passos = $$('.passo', seq);
    if (passos.length < 2) return;
    var i = 0;

    var controles = document.createElement('div');
    controles.className = 'sequencia__controles';
    controles.innerHTML =
      '<button type="button" class="botao-passo" data-dir="-1">Anterior</button>' +
      '<button type="button" class="botao-passo" data-dir="1">Próximo</button>' +
      '<p class="sequencia__estado" aria-live="polite"></p>' +
      '<div class="sequencia__pontos" role="group" aria-label="Ir para um passo"></div>';
    seq.insertBefore(controles, seq.firstChild);

    var anterior = $('[data-dir="-1"]', controles);
    var proximo = $('[data-dir="1"]', controles);
    var estado = $('.sequencia__estado', controles);
    var pontos = $('.sequencia__pontos', controles);

    passos.forEach(function (p, k) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', 'Passo ' + (k + 1) + ': ' + ($('strong', p) || p).textContent.replace(/\.$/, ''));
      b.addEventListener('click', function () { mostrar(k); });
      pontos.appendChild(b);
    });
    var botoes = $$('button', pontos);

    function mostrar(k) {
      i = Math.max(0, Math.min(passos.length - 1, k));
      passos.forEach(function (p, n) {
        var atual = n === i;
        p.classList.toggle('atual', atual);
        if (atual) p.removeAttribute('aria-hidden'); else p.setAttribute('aria-hidden', 'true');
      });
      botoes.forEach(function (b, n) {
        if (n === i) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
      });
      anterior.disabled = i === 0;
      proximo.disabled = i === passos.length - 1;
      var titulo = $('strong', passos[i]);
      estado.textContent = 'Passo ' + (i + 1) + ' de ' + passos.length + (titulo ? ' · ' + titulo.textContent.replace(/\.$/, '') : '');
    }

    anterior.addEventListener('click', function () { mostrar(i - 1); if (anterior.disabled) proximo.focus(); });
    proximo.addEventListener('click', function () { mostrar(i + 1); if (proximo.disabled) anterior.focus(); });
    seq.addEventListener('keydown', function (e) {
      if (e.target.tagName === 'INPUT') return;
      if (e.key === 'ArrowRight') { mostrar(i + 1); }
      else if (e.key === 'ArrowLeft') { mostrar(i - 1); }
    });
    mostrar(0);
  });

  /* ---------- escala da Maré: o controle troca as capturas ---------- */
  $$('[data-escala]').forEach(function (escala) {
    var entrada = $('input[type="range"]', escala);
    var estados = $$('.estado', escala);
    if (!entrada || !estados.length) return;
    function mostrar() {
      var v = Number(entrada.value);
      estados.forEach(function (e, n) {
        var atual = n === v;
        e.classList.toggle('atual', atual);
        if (atual) e.removeAttribute('aria-hidden'); else e.setAttribute('aria-hidden', 'true');
      });
      entrada.setAttribute('aria-valuetext', estados[v].dataset.nome);
    }
    entrada.addEventListener('input', mostrar);
    mostrar();
  });

  /* ---------- contato: um único canal, lido de js/dados.js ---------- */
  var canal = $('#canal');
  var c = (window.PORTFOLIO && window.PORTFOLIO.contato) || {};
  var msg = c.mensagem || '';
  var link = null;
  var numero = String(c.whatsapp || '').replace(/\D/g, '');
  var email = String(c.email || '').trim();
  var insta = String(c.instagram || '').replace(/^@/, '').trim();

  if (numero) {
    link = { href: 'https://wa.me/' + numero + (msg ? '?text=' + encodeURIComponent(msg) : ''), texto: 'Conversar pelo WhatsApp', externo: true };
  } else if (email) {
    link = { href: 'mailto:' + email + (msg ? '?subject=' + encodeURIComponent('Site') + '&body=' + encodeURIComponent(msg) : ''), texto: 'Escrever um e-mail', detalhe: email };
  } else if (insta) {
    link = { href: 'https://instagram.com/' + encodeURIComponent(insta), texto: 'Mandar mensagem no Instagram', detalhe: '@' + insta, externo: true };
  }

  if (canal && link) {
    var a = document.createElement('a');
    a.className = 'canal';
    a.href = link.href;
    a.textContent = link.texto;
    if (link.externo) {
      a.target = '_blank';
      a.rel = 'noopener';
      var aviso = document.createElement('span');
      aviso.className = 'sr';
      aviso.textContent = ' (abre em nova aba)';
      a.appendChild(aviso);
    }
    canal.appendChild(a);
    if (link.detalhe) {
      var d = document.createElement('span');
      d.className = 'canal__detalhe';
      d.textContent = link.detalhe;
      canal.appendChild(d);
    }
    canal.hidden = false;
  }
})();

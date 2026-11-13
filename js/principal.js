// Comportamento da página. Todo o conteúdo é legível sem este arquivo.
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var seta = function (d) { return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + (d < 0 ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7') + '"/></svg>'; };
  var temObservador = 'IntersectionObserver' in window;

  var ano = $('#ano');
  if (ano) ano.textContent = String(new Date().getFullYear());

  /* ---------- entrada suave das seções ---------- */
  var revelar = $$('[data-revela]');
  if (temObservador) {
    var obsRevela = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visto'); obsRevela.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    revelar.forEach(function (el) { obsRevela.observe(el); });
  } else {
    revelar.forEach(function (el) { el.classList.add('visto'); });
  }

  /* ---------- doca: aparece depois da apresentação e marca a seção atual ---------- */
  var doca = $('#doca');
  var chegada = $('#inicio');
  var itensDoca = $$('a[data-secao]', doca);
  function marcar(id) {
    itensDoca.forEach(function (a) {
      if (a.dataset.secao === id) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
  }
  if (doca && chegada && temObservador) {
    new IntersectionObserver(function (e) {
      doca.classList.toggle('visivel', !e[0].isIntersecting);
    }, { rootMargin: '-60% 0px 0px 0px' }).observe(chegada);
    var obsSecao = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) { if (e.isIntersecting) marcar(e.target.id); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['inicio', 'projetos', 'solucoes', 'processo', 'sobre', 'contato'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) obsSecao.observe(el);
    });
  }

  /* ---------- sequência de telas: um passo por vez ---------- */
  $$('[data-sequencia]').forEach(function (seq) {
    var passos = $$('.passo', seq);
    var nome = $('[data-sequencia-nome]', seq.closest('figure'));
    var i = 0;
    var controles = document.createElement('div');
    controles.className = 'sequencia__controles';
    controles.innerHTML =
      '<button type="button" class="botao-seta" data-dir="-1" aria-label="Tela anterior">' + seta(-1) + '</button>' +
      '<button type="button" class="botao-seta" data-dir="1" aria-label="Próxima tela">' + seta(1) + '</button>' +
      '<div class="sequencia__pontos" role="group" aria-label="Escolher tela"></div>';
    seq.appendChild(controles);
    var ant = $('[data-dir="-1"]', controles);
    var prox = $('[data-dir="1"]', controles);
    var pontos = $('.sequencia__pontos', controles);
    passos.forEach(function (p, k) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', 'Tela ' + (k + 1) + ': ' + p.dataset.titulo);
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
      if (nome) nome.textContent = (i + 1) + ' de ' + passos.length + ' · ' + passos[i].dataset.titulo;
    }
    ant.addEventListener('click', function () { mostrar(i - 1); if (ant.disabled) prox.focus(); });
    prox.addEventListener('click', function () { mostrar(i + 1); if (prox.disabled) ant.focus(); });
    mostrar(0);
  });

  /* ---------- seletor da Maré: troca a captura ---------- */
  $$('[data-escala]').forEach(function (escala) {
    var entrada = $('input[type="range"]', escala);
    var estados = $$('.estado', escala);
    var nome = $('[data-escala-nome]', escala.closest('figure'));
    function mostrar() {
      var v = Number(entrada.value);
      estados.forEach(function (e, n) {
        e.classList.toggle('atual', n === v);
        if (n === v) e.removeAttribute('aria-hidden'); else e.setAttribute('aria-hidden', 'true');
      });
      entrada.setAttribute('aria-valuetext', estados[v].dataset.nome);
      if (nome) nome.textContent = estados[v].dataset.nome;
    }
    entrada.addEventListener('input', mostrar);
    mostrar();
  });

  /* ---------- contato (js/dados.js) ---------- */
  var c = (window.PORTFOLIO && window.PORTFOLIO.contato) || {};
  var msg = c.mensagem || '';
  var numero = String(c.whatsapp || '').replace(/\D/g, '');
  var email = String(c.email || '').trim();
  var linkWpp = numero ? 'https://wa.me/' + numero + (msg ? '?text=' + encodeURIComponent(msg) : '') : '';
  var telefone = numero.length >= 12 ? '(' + numero.slice(2, 4) + ') ' + numero.slice(4, numero.length - 4) + '-' + numero.slice(-4) : numero;

  function el(tag, cls, texto) { var e = document.createElement(tag); if (cls) e.className = cls; if (texto) e.textContent = texto; return e; }
  function novaAba(a, aviso) {
    a.target = '_blank'; a.rel = 'noopener';
    a.appendChild(el('span', 'sr', aviso || ' (abre em nova aba)'));
  }

  var canais = $('#canais');
  if (canais) {
    if (linkWpp) {
      var principal = el('a', 'botao botao--vermelho', 'Conversar pelo WhatsApp');
      principal.href = linkWpp;
      novaAba(principal);
      canais.appendChild(principal);
    }
    var linha = function (rotulo, texto, href, externo) {
      var p = el('p', 'canal');
      p.appendChild(el('span', '', rotulo));
      var a = el('a', '', texto);
      a.href = href;
      if (externo) novaAba(a);
      p.appendChild(a);
      canais.appendChild(p);
    };
    if (numero) linha('WhatsApp', telefone, linkWpp, true);
    if (email) linha('E-mail', email, 'mailto:' + email, false);
  }

  var formulario = $('#formulario');
  if (formulario) {
    var aviso = $('#formulario-aviso');
    if (!numero && email) {
      $('button[type="submit"]', formulario).textContent = 'Continuar no e-mail';
      $('#formulario-nota').textContent = 'Nada é enviado por este formulário: ele abre o seu e-mail com a mensagem pronta para você conferir e enviar.';
    }
    if (!numero && !email) formulario.hidden = true;
    formulario.addEventListener('submit', function (e) {
      e.preventDefault();
      var nome = formulario.nome.value.trim();
      var negocio = formulario.negocio.value.trim();
      var tipo = formulario.tipo.value;
      var texto = formulario.mensagem.value.trim();
      formulario.nome.setAttribute('aria-invalid', String(!nome));
      formulario.mensagem.setAttribute('aria-invalid', String(!texto));
      if (!nome || !texto) {
        aviso.textContent = !nome && !texto ? 'Preencha seu nome e conte um pouco sobre o projeto.'
          : !nome ? 'Preencha seu nome.' : 'Conte um pouco sobre o projeto.';
        (!nome ? formulario.nome : formulario.mensagem).focus();
        return;
      }
      aviso.textContent = '';
      var corpo = 'Olá, Samuel! Sou ' + nome + (negocio ? ' (' + negocio + ')' : '') + '.\n' +
        (tipo ? 'Procuro: ' + tipo + '.\n' : '') + '\n' + texto;
      var destino = numero ? 'https://wa.me/' + numero + '?text=' + encodeURIComponent(corpo)
        : 'mailto:' + email + '?subject=' + encodeURIComponent('Projeto para ' + (negocio || nome)) + '&body=' + encodeURIComponent(corpo);
      window.open(destino, '_blank', 'noopener');
    });
    ['nome', 'mensagem'].forEach(function (campo) {
      formulario[campo].addEventListener('input', function () {
        if (formulario[campo].value.trim()) formulario[campo].removeAttribute('aria-invalid');
      });
    });
  }

  document.documentElement.classList.add('pronto');
})();

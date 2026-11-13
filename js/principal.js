// Comportamento da página. Todo o conteúdo é legível sem este arquivo.
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var dados = window.PORTFOLIO || {};
  var c = dados.contato || {};

  var ano = $('#ano');
  if (ano) ano.textContent = String(new Date().getFullYear());

  /* ---------- foto opcional no círculo da apresentação (js/dados.js) ---------- */
  var foto = $('#foto');
  if (foto && dados.foto) {
    foto.addEventListener('load', function () { foto.hidden = false; $('#iniciais').hidden = true; });
    foto.src = dados.foto;
  }

  /* ---------- menu no celular ---------- */
  var botaoMenu = $('#menu-botao');
  var menu = $('#menu');
  function fecharMenu() { menu.classList.remove('aberto'); botaoMenu.setAttribute('aria-expanded', 'false'); }
  if (botaoMenu && menu) {
    botaoMenu.addEventListener('click', function () {
      var abrir = !menu.classList.contains('aberto');
      menu.classList.toggle('aberto', abrir);
      botaoMenu.setAttribute('aria-expanded', String(abrir));
    });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) fecharMenu(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('aberto')) { fecharMenu(); botaoMenu.focus(); }
    });
  }

  /* ---------- seção atual no menu ---------- */
  var links = $$('a[data-secao]', menu);
  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) {
          if (a.dataset.secao === e.target.id) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    links.forEach(function (a) { var el = document.getElementById(a.dataset.secao); if (el) obs.observe(el); });
  }

  /* ---------- contato (js/dados.js) ---------- */
  var msg = c.mensagem || '';
  var numero = String(c.whatsapp || '').replace(/\D/g, '');
  var email = String(c.email || '').trim();
  var github = String(c.github || '').trim();
  var linkWpp = numero ? 'https://wa.me/' + numero + (msg ? '?text=' + encodeURIComponent(msg) : '') : '';
  var telefone = numero.length >= 12 ? '(' + numero.slice(2, 4) + ') ' + numero.slice(4, numero.length - 4) + '-' + numero.slice(-4) : numero;
  var icones = {
    whatsapp: '<path d="M4 20l1.3-3.9A8 8 0 1 1 8 19z"/><path d="M9 9.5c.3 2.3 2.4 4.4 4.7 4.7l1.1-1.2-1.6-.9-.8.6c-.8-.4-1.5-1.1-1.9-1.900l.6-.8-.9-1.600z"/>',
    email: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 6.500 12 13l8.500-6.500"/>',
    github: '<path d="M9 19c-4 1.300-4-2-6-2.500M15 22v-3.500c0-1 .1-1.400-.5-2 2.800-.3 5.500-1.400 5.500-6a4.600 4.600 0 0 0-1.300-3.200 4.200 4.200 0 0 0-.1-3.200s-1.100-.3-3.500 1.300a12 12 0 0 0-6.200 0C6.500 3.800 5.400 4.100 5.400 4.100a4.200 4.200 0 0 0-.1 3.200A4.600 4.600 0 0 0 4 10.500c0 4.600 2.700 5.700 5.500 6-.6.600-.6 1.200-.5 2V22"/>'
  };

  function el(tag, cls, texto) { var e = document.createElement(tag); if (cls) e.className = cls; if (texto) e.textContent = texto; return e; }
  function novaAba(a) { a.target = '_blank'; a.rel = 'noopener'; a.appendChild(el('span', 'sr', ' (abre em nova aba)')); }

  var lugarBotao = $('#botao-whatsapp');
  if (lugarBotao && linkWpp) {
    var principal = el('a', 'botao botao--vermelho', 'Conversar pelo WhatsApp');
    principal.href = linkWpp;
    novaAba(principal);
    lugarBotao.appendChild(principal);
  }

  var canais = $('#canais');
  function canal(icone, texto, href, externo) {
    var li = el('li');
    var a = el('a');
    a.href = href;
    a.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true">' + icones[icone] + '</svg>';
    a.appendChild(el('span', '', texto));
    if (externo) novaAba(a);
    li.appendChild(a);
    canais.appendChild(li);
  }
  if (canais) {
    if (numero) canal('whatsapp', telefone, linkWpp, true);
    if (email) canal('email', email, 'mailto:' + email, false);
    if (github) canal('github', 'github.com/' + github, 'https://github.com/' + github, true);
  }

  var formulario = $('#formulario');
  if (formulario) {
    var aviso = $('#formulario-aviso');
    if (!numero && email) {
      $('button[type="submit"]', formulario).textContent = 'Continuar no e-mail';
      $('#formulario-nota').textContent = 'Nada é enviado por aqui: o formulário abre o seu e-mail com a mensagem pronta para você conferir e enviar.';
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
})();

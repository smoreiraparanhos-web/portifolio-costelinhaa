// Comportamento da página. Todo o conteúdo é legível sem este arquivo.
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var seta = function (d) { return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + (d < 0 ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7') + '"/></svg>'; };
  var icones = {
    email: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 6.5 12 13l8.5-6.5"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20l1.3-3.9A8 8 0 1 1 8 19z"/><path d="M9 9.5c.3 2.3 2.4 4.4 4.7 4.7l1.1-1.2-1.6-.9-.8.6c-.8-.4-1.5-1.1-1.9-1.9l.6-.8-.9-1.6z"/></svg>',
    local: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
    copiar: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/></svg>'
  };

  var ano = $('#ano');
  if (ano) ano.textContent = String(new Date().getFullYear());

  /* ---------- hora de Eldorado do Sul ---------- */
  var hora = $('#hora');
  function atualizarHora() {
    try {
      hora.textContent = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' }).format(new Date());
    } catch (e) { hora.parentNode.removeChild(hora); }
  }
  if (hora) { atualizarHora(); setInterval(atualizarHora, 30000); }

  /* ---------- doca: no topo durante a chegada, embaixo depois ---------- */
  var doca = $('#doca');
  var chegada = $('#inicio');
  if (doca && chegada && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (e) {
      doca.classList.toggle('embaixo', !e[0].isIntersecting);
    }, { rootMargin: '-55% 0px 0px 0px' }).observe(chegada);
  }

  /* ---------- seção atual: chave, doca e índice lateral ---------- */
  var chaves = $$('.chave');
  var itensDoca = $$('.doca__item[data-secao]');
  var indice = $$('[data-indice]');
  function marcar(id) {
    chaves.forEach(function (c) { if (c.dataset.secao === id) c.setAttribute('data-escolhida', ''); else c.removeAttribute('data-escolhida'); });
    itensDoca.forEach(function (a) { if (a.dataset.secao === id) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
    indice.forEach(function (i) { i.classList.toggle('atual', i.dataset.indice === id); });
  }
  chaves.forEach(function (c) { c.addEventListener('click', function () { marcar(c.dataset.secao); }); });
  marcar('inicio');
  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) { if (e.isIntersecting) marcar(e.target.id); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['inicio', 'trabalhos', 'processo', 'habilidades', 'sobre', 'contato'].forEach(function (id) { var el = document.getElementById(id); if (el) obs.observe(el); });
  }

  /* ---------- progresso de leitura ---------- */
  var barra = $('#progresso-barra');
  var valor = $('#progresso-valor');
  var agendado = false;
  function progresso() {
    agendado = false;
    var max = document.documentElement.scrollHeight - innerHeight;
    var p = max > 0 ? Math.min(100, Math.max(0, scrollY / max * 100)) : 0;
    barra.style.height = p + '%';
    valor.parentNode.style.setProperty('--p', p + '%');
    valor.textContent = String(Math.round(p)).padStart(3, '0') + '%';
  }
  if (barra && valor) {
    addEventListener('scroll', function () { if (!agendado) { agendado = true; requestAnimationFrame(progresso); } }, { passive: true });
    progresso();
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
    seq.appendChild(controles);
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
      if (nome) nome.textContent = (i + 1) + '/' + passos.length + ' · ' + passos[i].dataset.titulo;
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
    var frascos = $$('[data-frascos] img', escala.closest('.detalhes'));
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
  var c = (window.PORTFOLIO && window.PORTFOLIO.contato) || {};
  var msg = c.mensagem || '';
  var numero = String(c.whatsapp || '').replace(/\D/g, '');
  var email = String(c.email || '').trim();
  var local = String(c.local || '').trim();
  var linkWpp = numero ? 'https://wa.me/' + numero + (msg ? '?text=' + encodeURIComponent(msg) : '') : '';
  var telefone = numero.length >= 12 ? '(' + numero.slice(2, 4) + ') ' + numero.slice(4, numero.length - 4) + '-' + numero.slice(-4) : numero;

  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html) e.innerHTML = html; return e; }

  // atalhos na chegada
  var rapidos = $('#contatos-rapidos');
  if (rapidos) {
    if (email) { var li = el('li'); var a = el('a', '', icones.email); a.href = 'mailto:' + email; a.appendChild(document.createTextNode(email)); li.appendChild(a); rapidos.appendChild(li); }
    if (numero) { var li2 = el('li'); var b = el('a', '', icones.whatsapp); b.href = linkWpp; b.target = '_blank'; b.rel = 'noopener'; b.appendChild(document.createTextNode(telefone)); li2.appendChild(b); rapidos.appendChild(li2); }
  }

  // linhas de contato com botão de copiar
  var canais = $('#canais');
  function linha(icone, rotulo, texto, href, copiavel) {
    var li = el('li', 'canal-linha');
    li.appendChild(el('span', 'canal-linha__icone', icones[icone]));
    var t = el('span', 'canal-linha__texto');
    t.appendChild(el('span', 'mono', rotulo));
    var v;
    if (href) { v = el('a'); v.href = href; if (/^https/.test(href)) { v.target = '_blank'; v.rel = 'noopener'; } } else { v = el('span'); }
    v.textContent = texto;
    t.appendChild(v);
    li.appendChild(t);
    if (copiavel && navigator.clipboard) {
      var btn = el('button', 'copiar', icones.copiar);
      btn.type = 'button';
      btn.setAttribute('aria-label', 'Copiar ' + rotulo);
      btn.addEventListener('click', function () {
        navigator.clipboard.writeText(copiavel).then(function () {
          btn.setAttribute('data-copiado', '');
          btn.setAttribute('aria-label', rotulo + ' copiado');
          setTimeout(function () { btn.removeAttribute('data-copiado'); btn.setAttribute('aria-label', 'Copiar ' + rotulo); }, 1800);
        });
      });
      li.appendChild(btn);
    }
    canais.appendChild(li);
  }
  if (canais) {
    if (email) linha('email', 'E-mail', email, 'mailto:' + email, email);
    if (numero) linha('whatsapp', 'WhatsApp', telefone, linkWpp, telefone);
    if (local) linha('local', 'Local', local, '', '');
  }

  var formulario = $('#formulario');
  if (formulario) {
    var aviso = $('#formulario-aviso');
    if (!linkWpp && email) $('button[type="submit"]', formulario).textContent = 'Abrir no e-mail';
    formulario.addEventListener('submit', function (e) {
      e.preventDefault();
      var nome = formulario.nome.value.trim();
      var negocio = formulario.negocio.value.trim();
      var texto = formulario.mensagem.value.trim();
      formulario.nome.setAttribute('aria-invalid', String(!nome));
      formulario.mensagem.setAttribute('aria-invalid', String(!texto));
      if (!nome || !texto) {
        aviso.textContent = 'Preencha seu nome e o que você precisa.';
        (!nome ? formulario.nome : formulario.mensagem).focus();
        return;
      }
      aviso.textContent = '';
      var corpo = 'Olá, Samuel! Sou ' + nome + (negocio ? ' (' + negocio + ')' : '') + '.\n\n' + texto;
      var destino = numero ? 'https://wa.me/' + numero + '?text=' + encodeURIComponent(corpo)
        : email ? 'mailto:' + email + '?subject=' + encodeURIComponent('Site para ' + (negocio || nome)) + '&body=' + encodeURIComponent(corpo) : '';
      if (destino) window.open(destino, '_blank', 'noopener');
    });
  }

  var canal = $('#canal');
  if (canal && (linkWpp || email)) {
    var principal = el('a', 'botao botao--vermelho');
    principal.href = linkWpp || ('mailto:' + email);
    principal.textContent = linkWpp ? 'Conversar pelo WhatsApp' : 'Escrever um e-mail';
    if (linkWpp) { principal.target = '_blank'; principal.rel = 'noopener'; var s = el('span', 'sr'); s.textContent = ' (abre em nova aba)'; principal.appendChild(s); }
    canal.appendChild(principal);
    canal.hidden = false;
  }
})();

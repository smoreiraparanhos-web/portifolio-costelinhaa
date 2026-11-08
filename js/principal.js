/* Samuel Moreira Paranhos — interações do portfólio */
(function () {
  'use strict';

  var D = window.PORTFOLIO || { vistas: {}, fotos: {}, projetos: [], detalhes: [], contato: {} };
  var reduzMovimento = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var LARGURA_BASE = { desktop: 1280, celular: 390 };

  /* ---------- utilitários ---------- */
  function el(tag, attrs, filhos) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'class') n.className = attrs[k];
      else if (k === 'text') n.textContent = attrs[k];
      else if (k === 'html') n.innerHTML = attrs[k];
      else if (attrs[k] !== null && attrs[k] !== undefined) n.setAttribute(k, attrs[k]);
    });
    (filhos || []).forEach(function (f) { if (f) n.appendChild(typeof f === 'string' ? document.createTextNode(f) : f); });
    return n;
  }
  function icone(id, cls) {
    var ns = 'http://www.w3.org/2000/svg';
    var s = document.createElementNS(ns, 'svg');
    s.setAttribute('aria-hidden', 'true');
    s.setAttribute('focusable', 'false');
    if (cls) s.setAttribute('class', cls);
    var u = document.createElementNS(ns, 'use');
    u.setAttribute('href', '#' + id);
    s.appendChild(u);
    return s;
  }
  function semProtocolo(url) { return (url || '').replace(/^https?:\/\//, '').replace(/\/$/, ''); }

  /* ---------- carregamento sob demanda ---------- */
  var filaPreguicosa = [];
  var observadorPreguicoso = ('IntersectionObserver' in window) ? new IntersectionObserver(function (entradas) {
    entradas.forEach(function (e) {
      if (e.isIntersecting) {
        observadorPreguicoso.unobserve(e.target);
        var fn = e.target.__carregar; if (fn) fn();
      }
    });
  }, { rootMargin: '400px 0px' }) : null;

  function quandoVisivel(alvo, fn, imediato) {
    if (imediato || !observadorPreguicoso) { fn(); return; }
    alvo.__carregar = fn;
    observadorPreguicoso.observe(alvo);
  }

  /* ---------- escala dos iframes ---------- */
  var observadorTamanho = ('ResizeObserver' in window) ? new ResizeObserver(function (entradas) {
    entradas.forEach(function (e) { ajustarEscala(e.target); });
  }) : null;

  function ajustarEscala(tela) {
    var iframe = tela.querySelector('iframe');
    if (!iframe) return;
    var base = Number(iframe.getAttribute('data-base')) || 1280;
    var w = tela.clientWidth, h = tela.clientHeight;
    if (!w || !h) return;
    var escala = w / base;
    iframe.style.width = base + 'px';
    iframe.style.height = Math.ceil(h / escala) + 'px';
    iframe.style.setProperty('--escala', escala);
  }
  window.addEventListener('resize', function () {
    if (observadorTamanho) return;
    document.querySelectorAll('.moldura__tela').forEach(ajustarEscala);
  });

  /* ---------- telas (vistas) ---------- */
  function montarVista(moldura, chave, opcoes) {
    opcoes = opcoes || {};
    var v = D.vistas[chave];
    if (!v) { moldura.remove(); return; }
    moldura.classList.add('moldura--' + v.formato);
    if (v.formato === 'desktop') moldura.setAttribute('data-endereco', semProtocolo(v.url.split('#')[0]));
    moldura.setAttribute('role', 'img');
    moldura.setAttribute('aria-label', v.titulo);

    var tela = el('div', { class: 'moldura__tela' });
    if (v.fundo) tela.appendChild(el('img', { class: 'moldura__fundo', src: v.fundo, alt: '', loading: opcoes.imediato ? 'eager' : 'lazy', decoding: 'async' }));
    tela.appendChild(el('span', { class: 'moldura__carregando', text: 'Carregando o site real…' }));
    moldura.appendChild(tela);

    quandoVisivel(moldura, function () { carregarConteudo(tela, v); }, opcoes.imediato);

    if (opcoes.semAcao) return;
    if (moldura.hasAttribute('data-ampliar')) {
      var b = el('button', { class: 'moldura__abrir', type: 'button', 'aria-label': 'Ampliar: ' + v.titulo }, [
        el('span', null, [icone('i-ampliar'), 'Ampliar'])
      ]);
      moldura.appendChild(b);
    } else {
      var a = el('a', { class: 'moldura__abrir', href: v.url, target: '_blank', rel: 'noopener', 'aria-label': 'Abrir o site real em nova aba: ' + v.titulo }, [
        el('span', null, ['Abrir site', icone('i-externo')])
      ]);
      moldura.appendChild(a);
    }
  }

  function carregarConteudo(tela, v) {
    var tentarIframe = function () {
      var iframe = el('iframe', {
        src: v.url, title: v.titulo, tabindex: '-1', 'aria-hidden': 'true',
        loading: 'lazy', referrerpolicy: 'no-referrer',
        sandbox: 'allow-scripts allow-same-origin',
        'data-base': LARGURA_BASE[v.formato] || 1280
      });
      iframe.addEventListener('load', function () { iframe.classList.add('carregado'); });
      tela.appendChild(iframe);
      ajustarEscala(tela);
      if (observadorTamanho) observadorTamanho.observe(tela);
    };
    if (!v.captura) { tentarIframe(); return; }
    var img = new Image();
    img.decoding = 'async';
    img.onload = function () {
      img.className = 'moldura__captura';
      img.alt = '';
      tela.appendChild(img);
    };
    img.onerror = tentarIframe;
    img.src = v.captura;
  }

  /* ---------- fotos reais ---------- */
  function montarFoto(caixa, chave, imediato) {
    var f = D.fotos[chave];
    if (!f) return;
    var img = el('img', { src: f.src, alt: f.alt, loading: imediato ? 'eager' : 'lazy', decoding: 'async' });
    img.addEventListener('error', function () { caixa.classList.add('foto-real--falhou'); img.alt = ''; });
    caixa.appendChild(img);
  }

  /* ---------- projetos ---------- */
  function lista(titulo, iconeId, itens) {
    return el('div', null, [
      el('h4', null, [icone(iconeId), titulo]),
      el('ul', null, itens.map(function (t) { return el('li', { text: t }); }))
    ]);
  }

  function montarProjetos() {
    var alvo = document.getElementById('lista-projetos');
    if (!alvo) return;
    D.projetos.filter(function (p) { return p.publicar; }).forEach(function (p) {
      var art = el('article', { class: 'projeto projeto--' + p.composicao, id: 'projeto-' + p.id, 'aria-labelledby': 'nome-' + p.id });
      var visual = el('div', { class: 'projeto__visual' });

      if (p.composicao === 'celulares') {
        ['a', 'b', 'c'].forEach(function (letra, i) {
          if (!p.vistas[i]) return;
          var m = el('div', { class: 'moldura', 'data-vista': p.vistas[i] });
          visual.appendChild(el('div', { class: 'projeto__vista-' + letra }, [m]));
        });
      } else {
        var m1 = el('div', { class: 'moldura', 'data-vista': p.vistas[0] });
        visual.appendChild(el('div', { class: 'projeto__vista-principal' }, [m1]));
        if (p.vistas[1]) {
          var m2 = el('div', { class: 'moldura', 'data-vista': p.vistas[1] });
          visual.appendChild(el('div', { class: 'projeto__vista-celular' }, [m2]));
        }
      }

      var cabeca = el('div', { class: 'projeto__cabeca' }, [
        p.rotuloStatus ? el('span', { class: 'projeto__status projeto__status--' + p.status, text: p.rotuloStatus }) : null,
        el('span', { class: 'projeto__negocio', text: p.negocio })
      ]);
      var titulo = el('div', null, [
        cabeca,
        el('h3', { class: 'projeto__nome', id: 'nome-' + p.id, text: p.nome }),
        el('p', { class: 'projeto__objetivo', text: p.objetivo })
      ]);
      var colunas = el('div', { class: 'projeto__colunas' }, [
        lista('O que desenvolvi', 'g-triangulo', p.desenvolvi),
        lista('Decisões que você pode observar', 'g-circulo', p.decisoes)
      ]);
      var link = p.url ? el('div', { class: 'projeto__link' }, [
        el('a', { class: 'botao botao--claro', href: p.url, target: '_blank', rel: 'noopener' }, ['Visitar ' + p.nome, icone('i-externo')]),
        el('span', { class: 'projeto__url', text: p.urlTexto || semProtocolo(p.url) })
      ]) : null;

      var info;
      if (p.composicao === 'celulares') {
        info = el('div', { class: 'projeto__info' }, [titulo, colunas, link]);
      } else {
        info = el('div', { class: 'projeto__info' }, [el('div', null, [titulo, link]), colunas]);
      }

      var nota = el('p', { class: 'projeto__nota-tela' }, [icone('g-ponto'), 'As telas mostram o site real. Use “Abrir site” para navegar por ele.']);
      visual.appendChild(nota);

      art.appendChild(visual);
      art.appendChild(info);
      alvo.appendChild(art);
    });
  }

  /* ---------- detalhes ---------- */
  function montarDetalhes() {
    var alvo = document.getElementById('grade-detalhes');
    if (!alvo) return;
    D.detalhes.forEach(function (d, i) {
      var fig = el('figure', { class: 'detalhe detalhe--' + d.tamanho });
      var visual = el('div', { class: 'detalhe__visual' });
      if (d.tipo === 'vista') {
        visual.appendChild(el('div', { class: 'moldura', 'data-vista': d.ref, 'data-sem-acao': '' }));
      } else if (d.tipo === 'foto') {
        visual.appendChild(el('div', { class: 'foto-real', 'data-foto': d.ref }));
      } else if (d.tipo === 'fotos') {
        visual.appendChild(el('div', { class: 'detalhe__fotos' }, d.refs.map(function (r) { return el('div', { class: 'foto-real', 'data-foto': r }); })));
      }
      var botao = el('button', { class: 'detalhe__ampliar', type: 'button', 'aria-label': 'Ampliar: ' + d.titulo, 'data-galeria': 'detalhes', 'data-indice': i }, [
        el('span', null, [icone('i-ampliar')])
      ]);
      visual.insertBefore(botao, visual.firstChild);
      fig.appendChild(visual);
      fig.appendChild(el('figcaption', null, [el('h3', { text: d.titulo }), el('p', { text: d.texto })]));
      alvo.appendChild(fig);
    });
  }

  /* ---------- galeria ---------- */
  var galeria = document.getElementById('galeria');
  var palco = document.getElementById('galeria-palco');
  var estado = { itens: [], indice: 0, origem: null };

  function itensDoGrupo(grupo) {
    if (grupo === 'detalhes') {
      return D.detalhes.map(function (d) {
        return { tipo: d.tipo, ref: d.ref, refs: d.refs, titulo: d.titulo, legenda: d.texto };
      });
    }
    return Array.prototype.map.call(document.querySelectorAll('[data-ampliar][data-grupo="' + grupo + '"]'), function (m) {
      var chave = m.getAttribute('data-vista');
      var art = m.closest('.passo-estudo');
      var h = art && art.querySelector('h3');
      return { tipo: 'vista', ref: chave, titulo: h ? h.textContent : D.vistas[chave].titulo, legenda: D.vistas[chave].titulo, gatilho: m };
    });
  }

  function desenharItem() {
    var it = estado.itens[estado.indice];
    palco.innerHTML = '';
    var link = document.getElementById('galeria-link');
    var url = '';
    if (it.tipo === 'vista') {
      var m = el('div', { class: 'moldura', 'data-vista': it.ref });
      palco.appendChild(m);
      montarVista(m, it.ref, { imediato: true, semAcao: true });
      url = D.vistas[it.ref] && D.vistas[it.ref].url;
    } else {
      var refs = it.tipo === 'fotos' ? it.refs : [it.ref];
      var cont = el('div', { class: 'galeria__fotos', style: 'display:grid;gap:10px;grid-template-columns:repeat(' + Math.min(refs.length, 4) + ',minmax(0,1fr));max-height:100%;width:100%;height:100%;' });
      refs.forEach(function (r) {
        var f = D.fotos[r];
        if (f) cont.appendChild(el('img', { src: f.src, alt: f.alt, style: 'width:100%;height:100%;object-fit:' + (refs.length > 1 ? 'cover' : 'contain') + ';min-height:0;' }));
      });
      palco.appendChild(cont);
    }
    document.getElementById('galeria-titulo').textContent = it.titulo;
    document.getElementById('galeria-legenda').textContent = it.legenda || '';
    document.getElementById('galeria-contador').textContent = (estado.indice + 1) + ' / ' + estado.itens.length;
    if (url) { link.hidden = false; link.href = url; } else { link.hidden = true; }
    var multiplo = estado.itens.length > 1;
    galeria.querySelector('[data-acao="anterior"]').hidden = !multiplo;
    galeria.querySelector('[data-acao="proxima"]').hidden = !multiplo;
  }

  function abrirGaleria(grupo, indice, origem) {
    if (!galeria || typeof galeria.showModal !== 'function') {
      var it = itensDoGrupo(grupo)[indice];
      if (it && it.tipo === 'vista') window.open(D.vistas[it.ref].url, '_blank', 'noopener');
      return;
    }
    estado.itens = itensDoGrupo(grupo);
    estado.indice = indice;
    estado.origem = origem;
    desenharItem();
    galeria.showModal();
    document.body.style.overflow = 'hidden';
    galeria.querySelector('[data-acao="fechar"]').focus();
  }
  function navegar(passo) {
    var n = estado.itens.length;
    estado.indice = (estado.indice + passo + n) % n;
    desenharItem();
  }
  function fecharGaleria() { if (galeria.open) galeria.close(); }

  if (galeria) {
    galeria.addEventListener('close', function () {
      palco.innerHTML = '';
      document.body.style.overflow = '';
      if (estado.origem && document.contains(estado.origem)) estado.origem.focus();
    });
    galeria.addEventListener('click', function (e) {
      if (e.target === galeria) { fecharGaleria(); return; }
      var b = e.target.closest('[data-acao]');
      if (!b) return;
      var a = b.getAttribute('data-acao');
      if (a === 'fechar') fecharGaleria();
      if (a === 'anterior') navegar(-1);
      if (a === 'proxima') navegar(1);
    });
    galeria.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); navegar(-1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); navegar(1); }
      else if (e.key === 'Escape') { e.preventDefault(); fecharGaleria(); }
    });
  }

  document.addEventListener('click', function (e) {
    var bd = e.target.closest('.detalhe__ampliar');
    if (bd) { abrirGaleria('detalhes', Number(bd.getAttribute('data-indice')), bd); return; }
    var bm = e.target.closest('.moldura__abrir');
    if (bm && bm.tagName === 'BUTTON') {
      var m = bm.closest('.moldura');
      var grupo = m.getAttribute('data-grupo');
      var todos = Array.prototype.slice.call(document.querySelectorAll('[data-ampliar][data-grupo="' + grupo + '"]'));
      abrirGaleria(grupo, Math.max(0, todos.indexOf(m)), bm);
    }
  });

  /* ---------- menu do celular ---------- */
  var botaoMenu = document.querySelector('.menu-botao');
  var menu = document.getElementById('menu-movel');
  function focaveis(c) { return Array.prototype.slice.call(c.querySelectorAll('a[href], button:not([disabled])')); }
  function abrirMenu() {
    menu.hidden = false;
    botaoMenu.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    var f = focaveis(menu); if (f[1]) f[1].focus();
  }
  function fecharMenu(devolverFoco) {
    menu.hidden = true;
    botaoMenu.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (devolverFoco) botaoMenu.focus();
  }
  if (botaoMenu && menu) {
    botaoMenu.addEventListener('click', abrirMenu);
    menu.querySelector('.menu-movel__fechar').addEventListener('click', function () { fecharMenu(true); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a[href^="#"]')) fecharMenu(false); });
    menu.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { fecharMenu(true); return; }
      if (e.key !== 'Tab') return;
      var f = focaveis(menu), primeiro = f[0], ultimo = f[f.length - 1];
      if (e.shiftKey && document.activeElement === primeiro) { e.preventDefault(); ultimo.focus(); }
      else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primeiro.focus(); }
    });
    window.matchMedia('(min-width: 901px)').addEventListener('change', function (m) { if (m.matches && !menu.hidden) fecharMenu(false); });
  }

  /* ---------- navegação ativa ---------- */
  var mapaSecoes = { projetos: 'projetos', 'estudo-rodrigues': 'projetos', detalhes: 'projetos', sobre: 'sobre', servicos: 'servicos', processo: 'servicos', perguntas: 'servicos', contato: 'contato' };
  var linksNav = document.querySelectorAll('.nav__lista a[data-secao]');
  function marcarAtivo(nome) {
    linksNav.forEach(function (a) {
      if (a.getAttribute('data-secao') === nome) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  }
  if ('IntersectionObserver' in window) {
    var obsSecao = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) { if (e.isIntersecting) marcarAtivo(mapaSecoes[e.target.id] || ''); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(mapaSecoes).concat(['inicio']).forEach(function (id) { var s = document.getElementById(id); if (s) obsSecao.observe(s); });
  }

  /* ---------- progresso de leitura ---------- */
  var progresso = document.querySelector('.topo');
  var agendado = false;
  function atualizarProgresso() {
    agendado = false;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    progresso.style.setProperty('--progresso', p.toFixed(4));
  }
  window.addEventListener('scroll', function () { if (!agendado) { agendado = true; requestAnimationFrame(atualizarProgresso); } }, { passive: true });

  /* ---------- contato ---------- */
  function montarContato() {
    var c = D.contato || {};
    var canais = [];
    if (c.whatsapp) canais.push({ id: 'whatsapp', rotulo: 'WhatsApp', icone: 'i-whatsapp', href: 'https://wa.me/' + c.whatsapp.replace(/\D/g, '') });
    if (c.email) canais.push({ id: 'email', rotulo: c.email, icone: 'i-email', href: 'mailto:' + c.email });
    if (c.instagram) canais.push({ id: 'instagram', rotulo: '@' + c.instagram.replace(/^@/, ''), icone: 'i-instagram', href: 'https://instagram.com/' + c.instagram.replace(/^@/, '') });

    var listaCanais = document.getElementById('canais-diretos');
    var rodapeCanais = document.getElementById('rodape-canais');
    if (canais.length) {
      canais.forEach(function (k) {
        var externo = k.id !== 'email';
        listaCanais.appendChild(el('li', null, [el('a', { href: k.href, target: externo ? '_blank' : null, rel: externo ? 'noopener' : null }, [icone(k.icone), k.rotulo])]));
        rodapeCanais.appendChild(el('li', null, [el('a', { href: k.href, target: externo ? '_blank' : null, rel: externo ? 'noopener' : null, text: k.id === 'whatsapp' ? 'WhatsApp' : k.rotulo })]));
      });
    } else {
      listaCanais.appendChild(el('li', null, [el('p', { class: 'contato__aviso', text: 'Os canais diretos de contato serão publicados aqui em breve. Enquanto isso, você já pode montar sua mensagem ao lado e copiá-la.' })]));
      rodapeCanais.appendChild(el('li', null, [el('span', { text: 'Em breve' })]));
    }

    var acoes = document.getElementById('acoes-mensagem');
    var form = document.getElementById('form-mensagem');
    var status = document.getElementById('mensagem-status');
    var erro = document.getElementById('mensagem-erro');

    function texto() {
      var f = form.elements;
      var partes = [c.saudacao || 'Olá, Samuel!', '', 'Meu nome: ' + f.nome.value.trim(), 'Tipo de negócio: ' + f.negocio.value.trim()];
      if (f.precisa.value.trim()) partes.push('O que quero apresentar no site: ' + f.precisa.value.trim());
      return partes.join('\n');
    }
    function valido() {
      var ok = true, f = form.elements, faltando = [];
      ['nome', 'negocio'].forEach(function (n) {
        var vazio = !f[n].value.trim();
        f[n].setAttribute('aria-invalid', vazio ? 'true' : 'false');
        if (vazio) { ok = false; faltando.push(n === 'nome' ? 'seu nome' : 'o tipo de negócio'); }
      });
      if (!ok) {
        erro.hidden = false;
        erro.textContent = 'Para montar a mensagem, preencha ' + faltando.join(' e ') + '.';
        f[faltando[0] === 'seu nome' ? 'nome' : 'negocio'].focus();
      } else { erro.hidden = true; erro.textContent = ''; }
      return ok;
    }

    if (c.whatsapp) {
      var bw = el('button', { type: 'button', class: 'botao botao--primario' }, [icone('i-whatsapp'), 'Enviar pelo WhatsApp']);
      bw.addEventListener('click', function () {
        if (!valido()) return;
        window.open('https://wa.me/' + c.whatsapp.replace(/\D/g, '') + '?text=' + encodeURIComponent(texto()), '_blank', 'noopener');
        status.textContent = 'Abrimos o WhatsApp com a sua mensagem. O envio acontece lá, quando você tocar em enviar.';
      });
      acoes.appendChild(bw);
    }
    if (c.email) {
      var be = el('button', { type: 'button', class: 'botao ' + (c.whatsapp ? 'botao--contorno' : 'botao--primario') }, [icone('i-email'), 'Enviar por e-mail']);
      be.addEventListener('click', function () {
        if (!valido()) return;
        window.location.href = 'mailto:' + c.email + '?subject=' + encodeURIComponent('Site para ' + form.elements.negocio.value.trim()) + '&body=' + encodeURIComponent(texto());
        status.textContent = 'Abrimos o seu aplicativo de e-mail com a mensagem pronta.';
      });
      acoes.appendChild(be);
    }
    var bc = el('button', { type: 'button', class: 'botao ' + (canais.length ? 'botao--contorno' : 'botao--escuro') }, [icone('i-copiar'), 'Copiar mensagem']);
    bc.addEventListener('click', function () {
      if (!valido()) return;
      var t = texto();
      var feito = function () { status.textContent = 'Mensagem copiada. É só colar no canal que preferir.'; };
      var falhou = function () { status.textContent = 'Não consegui copiar automaticamente neste navegador. Selecione o texto dos campos e copie manualmente.'; };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(feito, falhou);
      else falhou();
    });
    acoes.appendChild(bc);
    form.addEventListener('submit', function (e) { e.preventDefault(); });
    form.addEventListener('input', function (e) { if (e.target.getAttribute('aria-invalid') === 'true' && e.target.value.trim()) e.target.setAttribute('aria-invalid', 'false'); });
  }

  function montarRodapeProjetos() {
    var ul = document.getElementById('rodape-projetos');
    if (!ul) return;
    D.projetos.filter(function (p) { return p.publicar && p.url; }).forEach(function (p) {
      ul.appendChild(el('li', null, [el('a', { href: p.url, target: '_blank', rel: 'noopener' }, [p.nome, icone('i-externo')])]));
    });
  }

  /* ---------- revelar ao rolar ---------- */
  function revelar() {
    if (reduzMovimento || !('IntersectionObserver' in window)) return;
    var alvos = document.querySelectorAll('.secao__cabeca, .estudo__cabeca, .projeto__visual, .projeto__info, .passo-estudo, .detalhe, .sobre__texto, .sobre__composicao, .servico, .etapa, .pergunta, .perguntas__cabeca, .contato__texto, .mensagem, .estudo__bastidor');
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visivel'); obs.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    alvos.forEach(function (a, i) {
      a.classList.add('revelar');
      a.style.transitionDelay = ((i % 3) * 70) + 'ms';
      obs.observe(a);
    });
  }

  /* ---------- iniciar ---------- */
  montarProjetos();
  montarDetalhes();
  document.querySelectorAll('[data-vista]').forEach(function (m) {
    if (m.closest('.galeria')) return;
    montarVista(m, m.getAttribute('data-vista'), {
      imediato: m.getAttribute('data-prioridade') === 'alta',
      semAcao: m.hasAttribute('data-sem-acao')
    });
  });
  document.querySelectorAll('[data-foto]').forEach(function (c) {
    montarFoto(c, c.getAttribute('data-foto'), c.getAttribute('data-prioridade') === 'alta');
  });
  montarContato();
  montarRodapeProjetos();
  revelar();
  atualizarProgresso();
})();

// Gera as capturas reais usadas no portfólio.
//
// Os dois projetos são servidos a partir de cópias locais, em "localhost".
// Assim a Rodrigues TheBarber usa a própria agenda simulada (js/agenda-simulada.js)
// e nenhum pedido de teste chega ao painel da barbearia. O navegador também
// bloqueia qualquer endereço externo, exceto as fontes do Google.
//
// Como usar:
//   1. Clone os projetos ao lado desta pasta (ou informe os caminhos):
//        git clone https://github.com/smoreiraparanhos-web/rodriguesthebarber ../rodriguesthebarber
//        git clone https://github.com/smoreiraparanhos-web/mare-de-essencias ../mare-de-essencias
//   2. npm install --no-save playwright   e   npx playwright install chromium
//   3. node ferramentas/capturar-telas.mjs [caminho-rodrigues] [caminho-mare]
//
// As imagens vão para assets/projetos/<projeto>/ em WebP (conversão com Python + Pillow)
// ou PNG, se o Pillow não estiver disponível.

import { createServer } from 'node:http';
import { readFile, mkdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pastaRodrigues = path.resolve(process.argv[2] || path.join(raiz, '../rodriguesthebarber'));
const pastaMare = path.resolve(process.argv[3] || path.join(raiz, '../mare-de-essencias'));
for (const p of [pastaRodrigues, pastaMare]) {
  if (!existsSync(path.join(p, 'index.html'))) { console.error('Projeto não encontrado em', p); process.exit(1); }
}

const tipos = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.svg': 'image/svg+xml', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.json': 'application/json',
  '.webmanifest': 'application/manifest+json' };

function servir(pasta, porta) {
  return new Promise((ok) => {
    const s = createServer(async (req, res) => {
      let caminho = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      if (caminho.endsWith('/')) caminho += 'index.html';
      const arquivo = path.join(pasta, path.normalize(caminho));
      if (!arquivo.startsWith(pasta)) { res.writeHead(403).end(); return; }
      try {
        const dados = await readFile(arquivo);
        res.writeHead(200, { 'Content-Type': tipos[path.extname(arquivo)] || 'application/octet-stream' }).end(dados);
      } catch { res.writeHead(404).end(); }
    });
    s.listen(porta, () => ok(s));
  });
}

const R = 'http://localhost:8231/';
const M = 'http://localhost:8232/';
const servidores = [await servir(pastaRodrigues, 8231), await servir(pastaMare, 8232)];

const tmp = path.join(raiz, 'ferramentas/.capturas-tmp');
await rm(tmp, { recursive: true, force: true });
await mkdir(tmp, { recursive: true });

const DESKTOP = { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1.5 };
const CELULAR = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true };

const navegador = await chromium.launch();
const saidas = []; // [png temporário, destino sem extensão, largura máxima]

async function abrir(url, formato) {
  const ctx = await navegador.newContext({ ...formato, reducedMotion: 'reduce', locale: 'pt-BR', timezoneId: 'America/Sao_Paulo' });
  await ctx.route('**/*', (r) => {
    const u = r.request().url();
    if (u.startsWith('http://localhost:') || u.startsWith('https://fonts.googleapis.com') || u.startsWith('https://fonts.gstatic.com')) r.continue();
    else r.abort();
  });
  const pagina = await ctx.newPage();
  await pagina.goto(url, { waitUntil: 'networkidle' });
  await pagina.evaluate(() => document.fonts.ready);
  // percorre a página para carregar imagens preguiçosas e revelar seções
  await pagina.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); }
    scrollTo(0, 0);
  });
  await pagina.waitForTimeout(700);
  return { ctx, pagina };
}

let n = 0;
// Cabeçalhos fixos cobrem os recortes de seção; escondê-los deixa só a parte analisada.
const fixos = '#topo, .barra-agendar, .header, .announce { visibility: hidden !important; }';

async function tela(pagina, destino, opcoes = {}) {
  const png = path.join(tmp, `${n++}.png`);
  if (opcoes.elemento) {
    const estilo = await pagina.addStyleTag({ content: fixos });
    const el = pagina.locator(opcoes.elemento).first();
    await el.scrollIntoViewIfNeeded();
    await pagina.waitForTimeout(opcoes.espera ?? 400);
    await el.screenshot({ path: png });
    await estilo.evaluate((e) => e.remove());
  } else {
    await pagina.waitForTimeout(opcoes.espera ?? 400);
    await pagina.screenshot({ path: png, clip: opcoes.clip });
  }
  saidas.push([png, destino, opcoes.largura || 1600]);
  console.log('ok', destino);
}

// Recorte entre o topo de um elemento e a base de outro, na largura de um terceiro.
async function recorte(pagina, destino, topo, base, largo, opcoes = {}) {
  const estilo = await pagina.addStyleTag({ content: fixos });
  await pagina.waitForTimeout(opcoes.espera ?? 400);
  const clip = await pagina.evaluate(([t, b, l, m]) => {
    const r = (s) => document.querySelector(s).getBoundingClientRect();
    const T = r(t), B = r(b), L = r(l);
    return { x: L.left - m, y: T.top + scrollY - m, width: L.width + m * 2, height: B.bottom - T.top + m * 2 };
  }, [topo, base, largo, opcoes.margem ?? 12]);
  const png = path.join(tmp, `${n++}.png`);
  await pagina.screenshot({ path: png, clip, fullPage: true });
  await estilo.evaluate((e) => e.remove());
  saidas.push([png, destino, opcoes.largura || 780]);
  console.log('ok', destino);
}

async function rolarAte(pagina, seletor, ajuste = 0) {
  await pagina.evaluate(([s, a]) => {
    const el = document.querySelector(s);
    scrollTo(0, el.getBoundingClientRect().top + scrollY + a);
  }, [seletor, ajuste]);
  await pagina.waitForTimeout(500);
}

/* ---------------- Rodrigues TheBarber ---------------- */
{
  const { ctx, pagina } = await abrir(R, DESKTOP);
  await tela(pagina, 'rodrigues/abertura-computador', { largura: 1920 });
  await tela(pagina, 'rodrigues/placa-horario', { elemento: '.porta', largura: 1000 });
  // agendamento no computador: o relógio gira até o horário escolhido
  await pagina.selectOption('#servico', { index: 3 });
  const dia = pagina.locator('#dias .chip:not([aria-label*="domingo"])').nth(2);
  await dia.click();
  await pagina.waitForSelector('#horarios .chip');
  const tarde = pagina.locator('#periodos [data-periodo="Tarde"]');
  if (await tarde.isEnabled()) await tarde.click();
  await pagina.locator('#horarios .chip').nth(4).click();
  await tela(pagina, 'rodrigues/agenda-relogio', { elemento: '#agendar', espera: 1800, largura: 1920 });
  await ctx.close();
}
{
  const { ctx, pagina } = await abrir(R, CELULAR);
  await tela(pagina, 'rodrigues/abertura-celular', { largura: 780 });
  await pagina.setViewportSize({ width: 390, height: 844 });
  // sequência no celular: preços e trabalhos com a barra fixa de agendamento
  await rolarAte(pagina, '#precos', 0);
  await tela(pagina, 'rodrigues/celular-precos', { largura: 780 });
  // passo a passo do pedido de horário (agenda simulada)
  await pagina.setViewportSize({ width: 390, height: 1300 });
  await rolarAte(pagina, '#ficha', -20);
  await pagina.selectOption('#servico', { index: 3 });
  await recorte(pagina, 'rodrigues/pedido-1', '.ficha-topo', '.quando', '#ficha');
  await pagina.locator('#dias .chip:not([aria-label*="domingo"])').nth(2).click();
  await pagina.waitForSelector('#horarios .chip');
  await recorte(pagina, 'rodrigues/pedido-2', '.quando', '.quando', '#ficha', { espera: 900 });
  const tarde = pagina.locator('#periodos [data-periodo="Tarde"]');
  if (await tarde.isEnabled()) await tarde.click();
  await pagina.locator('#horarios .chip').nth(4).click();
  await recorte(pagina, 'rodrigues/pedido-3', '#periodos', '#enviar', '#ficha', { espera: 900 });
  await pagina.fill('#nome', 'Visitante');
  await pagina.fill('#telefone', '(51) 9');
  await pagina.locator('#telefone').blur();
  await pagina.evaluate(() => document.querySelector('#ficha').requestSubmit());
  await recorte(pagina, 'rodrigues/pedido-4', '#nome', '#enviar', '#ficha', { espera: 500 });
  await ctx.close();
}

/* ---------------- Maré de Essências ---------------- */
{
  const { ctx, pagina } = await abrir(M, DESKTOP);
  await tela(pagina, 'mare/abertura-computador', { largura: 1920 });
  await tela(pagina, 'mare/familias', { elemento: '.families', largura: 1920 });
  for (const [i, v] of [0, 33, 67, 100].entries()) {
    await pagina.evaluate((valor) => {
      const r = document.querySelector('#tide-range');
      r.value = valor; r.dispatchEvent(new Event('input', { bubbles: true }));
    }, v);
  }
  await ctx.close();
}
{
  const { ctx, pagina } = await abrir(M, CELULAR);
  await tela(pagina, 'mare/abertura-celular', { largura: 780 });
  await rolarAte(pagina, '#guia', -10);
  await tela(pagina, 'mare/guia-celular', { largura: 780 });
  for (const [i, v] of [0, 33, 67, 100].entries()) {
    await pagina.evaluate((valor) => {
      const r = document.querySelector('#tide-range');
      r.value = valor; r.dispatchEvent(new Event('input', { bubbles: true }));
    }, v);
    await recorte(pagina, `mare/mare-celular-${i + 1}`, '.tide-control', '.tide-result', '.tide-copy', { espera: 700 });
    await recorte(pagina, `mare/frasco-celular-${i + 1}`, '.tide-glass', '.tide-glass', '.tide-glass', { margem: 24, largura: 520 });
  }
  await ctx.close();
}

await navegador.close();
servidores.forEach((s) => s.close());

/* ---------------- conversão ---------------- */
const destinoBase = path.join(raiz, 'assets/projetos');
const lista = JSON.stringify(saidas.map(([png, d, w]) => [png, path.join(destinoBase, d), w]));
const conversor = `
import json, sys, os
from PIL import Image
for png, destino, largura in json.loads(sys.argv[1]):
    os.makedirs(os.path.dirname(destino), exist_ok=True)
    im = Image.open(png).convert('RGB')
    if im.width > largura:
        im = im.resize((largura, round(im.height * largura / im.width)), Image.LANCZOS)
    im.save(destino + '.webp', 'WEBP', quality=80, method=6)
    print(os.path.relpath(destino + '.webp'), im.width, 'x', im.height)
`;
try {
  execFileSync('python3', ['-c', conversor, lista], { stdio: 'inherit' });
  await rm(tmp, { recursive: true, force: true });
} catch {
  console.log('Pillow indisponível: os PNG ficaram em', tmp);
}
console.log('\nPronto. Confira as imagens em assets/projetos/ antes de publicar.');

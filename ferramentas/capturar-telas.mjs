// Gera as capturas de tela reais dos projetos listados em js/dados.js.
//
// Como usar (no seu computador, dentro da pasta do portfólio):
//   1. Instale o Node.js (https://nodejs.org) se ainda não tiver.
//   2. npm install --no-save playwright
//   3. npx playwright install chromium
//   4. node ferramentas/capturar-telas.mjs
//
// As imagens são salvas em assets/capturas/. Quando uma captura existe,
// o portfólio passa a usar a imagem no lugar do site carregado ao vivo.

import { readFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import vm from 'node:vm';
import { chromium } from 'playwright';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const contexto = { window: {} };
vm.runInNewContext(readFileSync(path.join(raiz, 'js/dados.js'), 'utf8'), contexto);
const { vistas } = contexto.window.PORTFOLIO;

const tamanhos = {
  desktop: { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1.5 },
  celular: { viewport: { width: 390, height: 800 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }
};

mkdirSync(path.join(raiz, 'assets/capturas'), { recursive: true });
const navegador = await chromium.launch();

for (const [chave, v] of Object.entries(vistas)) {
  if (!v.captura) continue;
  const ctx = await navegador.newContext({ ...tamanhos[v.formato], reducedMotion: 'reduce' });
  const pagina = await ctx.newPage();
  try {
    await pagina.goto(v.url, { waitUntil: 'networkidle', timeout: 60000 });
    const ancora = v.url.split('#')[1];
    if (ancora) {
      await pagina.evaluate((id) => {
        const alvo = document.getElementById(id);
        if (alvo) { alvo.scrollIntoView({ block: 'start' }); }
      }, ancora);
    }
    await pagina.waitForTimeout(1500);
    const destino = path.join(raiz, v.captura);
    await pagina.screenshot({ path: destino, type: 'jpeg', quality: 82 });
    console.log('ok   ', chave, '→', v.captura);
  } catch (erro) {
    console.log('falha', chave, erro.message);
  }
  await ctx.close();
}

await navegador.close();
console.log('\nPronto. Confira as imagens em assets/capturas/ antes de publicar.');

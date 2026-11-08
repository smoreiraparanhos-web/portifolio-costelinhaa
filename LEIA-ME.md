# Portfólio — Samuel Moreira Paranhos

Site estático em HTML, CSS e JavaScript, sem dependências, pronto para o GitHub Pages.

## Estrutura

```
index.html                    conteúdo: textos, projetos e capturas (cada projeto é um <article>)
css/estilo.css                apresentação: cores, escala, grade e componentes (tokens no topo, em :root)
js/dados.js                   ← EDITE AQUI: canal de contato
js/principal.js               comportamento: barra guia, chave escolhida, passo a passo, seletor da Maré, contato
assets/projetos/<projeto>/    capturas reais (WebP) geradas pelo script
assets/img/favicon.svg        ícone da aba
ferramentas/capturar-telas.mjs  gera as capturas a partir de cópias locais dos projetos
```

## Ver no computador

```
python3 -m http.server 8000
```

Depois abra `http://localhost:8000`.

## Editar

- **Contato:** em `js/dados.js`, preencha um canal (`whatsapp`, `email` ou `instagram`). A seção “Conversa” mostra um único botão com o primeiro canal preenchido. Com todos vazios, nenhum botão aparece.
- **Textos de um projeto:** no `index.html`, dentro do `<article>` do projeto. Cada momento (`<section class="momento">`) junta um texto curto e a captura que o sustenta.
- **Novo projeto (ex.: Camisa em Campo):** copie um `<article class="projeto">`, troque textos e imagens e ajuste a cor de identidade em `style="--projeto: #..."`. Só publique quando houver capturas reais suficientes.
- **Cores, tipografia e espaçamentos:** no topo de `css/estilo.css`.

## Capturas

As capturas mostram as interfaces reais. O script serve os dois projetos em `localhost`. Desse jeito, a Rodrigues TheBarber usa a própria agenda simulada e nenhum pedido de teste chega à barbearia. Endereços externos ficam bloqueados (exceto as fontes do Google).

```
git clone https://github.com/smoreiraparanhos-web/rodriguesthebarber ../rodriguesthebarber
git clone https://github.com/smoreiraparanhos-web/mare-de-essencias ../mare-de-essencias
npm install --no-save playwright
npx playwright install chromium
node ferramentas/capturar-telas.mjs
```

A conversão para WebP usa Python com Pillow (`pip install pillow`). Confira as imagens antes de publicar: nenhuma pode mostrar dados de clientes nem o painel interno.

## Sistema visual (resumo)

- **Cor:** o preto domina, em quatro profundidades (parede, fundo, superfície, linha). O roxo dá atmosfera e luz. O vermelho é o acento: foco do teclado, chave escolhida e botão de contato. Os projetos mantêm as cores próprias nas capturas.
- **Tipografia:** escala em √φ (1,272), com base de 17 px. Dois passos equivalem a φ. Fraunces nos títulos, Schibsted Grotesk no texto.
- **Espaço:** intervalos de 8·φⁿ arredondados (8, 13, 21, 34, 55, 89, 144, 233 px) e grade de 12 colunas. O texto ocupa 4 colunas e a evidência 8, com inversão nos detalhes.
- **Porta-chaves:** passo dos ganchos = largura da cabeça + 21 px. As hastes crescem em 1 · 1,13 · 1,272 · 1,414.
- **Movimento:** três famílias. A resposta das chaves (sobe 3 px, gira 2° e acende), a aproximação e o assentamento das capturas guiados pela rolagem, e a troca suave de estado no passo a passo e no seletor. Tudo é desativado com “reduzir movimento”, e nenhum conteúdo depende de animação para aparecer.

## Publicar no GitHub Pages

Em **Settings → Pages**, escolha **Deploy from a branch**, branch `main` e pasta `/ (root)`.

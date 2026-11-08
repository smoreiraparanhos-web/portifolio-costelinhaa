# Portfólio — Samuel Moreira Paranhos

Site estático em HTML, CSS e JavaScript, sem dependências, pronto para o GitHub Pages.

## Estrutura

```
index.html                    conteúdo: chegada, vitrines dos projetos (cada uma é um <article class="vitrine">), processo, sobre e contato
css/estilo.css                apresentação: cores, escala, grade e componentes (tokens no topo, em :root)
js/dados.js                   ← EDITE AQUI: canal de contato
js/principal.js               comportamento: palco da chegada, chave escolhida, passo a passo, seletor da Maré, botão de voltar, contato
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

- **Contato:** em `js/dados.js` (WhatsApp, e-mail e local). Os atalhos da abertura, os cartões de contato com botão de copiar e o botão principal são montados a partir desses dados.
- **Projeto:** no `index.html`, cada `<article class="projeto">` tem selos, nome, uma frase, três destaques, tecnologias, link e um painel com três capturas (computador e dois celulares). Logo abaixo, `<div class="detalhes">` reúne três cartões de detalhe; `--pos` escolhe o recorte da imagem.
- **Novo projeto (ex.: Camisa em Campo):** copie um `article.projeto` e o `div.detalhes` seguinte, troque textos e capturas e atualize o número “(02)” e o cartão “Sites no ar”.
- **Números:** a seção `.numeros` usa só fatos verificáveis dos projetos. Ao mudar um projeto, revise esses números.
- **Cores e fontes:** no topo de `css/estilo.css`.

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

- **Estilo:** escuro e tecnológico, com grade de pontos, cards de borda fina, etiquetas em fonte mono (Space Mono) e títulos em Oxanium.
- **Cor:** o roxo faz a luz e os destaques; o vermelho é sinal e ação (Contato, privacidade, botão do WhatsApp). As capturas mantêm as cores de cada projeto.
- **Porta-chaves:** placa de metal parafusada com quatro chaves de silhuetas diferentes e etiquetas esmaltadas. Depois da abertura, a doca flutuante embaixo repete as quatro chaves em miniatura e marca a seção atual.
- **Movimento:** as chaves respondem ao mouse e ao foco, a faixa de texto corre (para ao passar o mouse) e o passo a passo e o seletor trocam de estado suavemente. Tudo é desativado com “reduzir movimento”.

## Publicar no GitHub Pages

Em **Settings → Pages**, escolha **Deploy from a branch**, branch `main` e pasta `/ (root)`.

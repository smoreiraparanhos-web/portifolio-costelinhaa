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

- **Contato:** em `js/dados.js`, preencha um canal (`whatsapp`, `email` ou `instagram`). A seção “Conversa” mostra um único botão com o primeiro canal preenchido. Com todos vazios, nenhum botão aparece.
- **Projeto:** no `index.html`, cada `<article class="vitrine">` tem nome, tipo, até quatro detalhes curtos, o link e um mosaico de 5 peças (`<figure class="peca">`). `peca--alta` ocupa duas linhas, `peca--larga` duas colunas; `--pos` escolhe o recorte da imagem.
- **Novo projeto (ex.: Camisa em Campo):** copie uma vitrine, troque textos e capturas e ajuste a cor de identidade em `style="--projeto: #..."`. Para aparecer na chegada, acrescente uma `<figure class="palco__cena">` com uma captura de computador e uma de celular.
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
- **Largura total:** as seções ocupam a tela inteira; só a margem lateral (`--borda`, de 16 a 80 px) acompanha a janela. Tipografia e espaços fluidos com `clamp()`.
- **Mosaico:** grade de 4 colunas com linhas de mesma altura (2 colunas no celular), para as peças sempre alinharem.
- **Tipografia:** Fraunces nos títulos, Schibsted Grotesk no texto.
- **Porta-chaves:** passo dos ganchos = largura da cabeça + 21 px. As hastes crescem em 1 · 1,13 · 1,272 · 1,414.
- **Movimento:** a resposta das chaves (sobe 3 px, gira 2° e acende), a troca do palco a cada 5 s (para ao passar o mouse, focar ou escolher) e a troca suave de estado no passo a passo e no seletor. Tudo é desativado com “reduzir movimento”.

## Publicar no GitHub Pages

Em **Settings → Pages**, escolha **Deploy from a branch**, branch `main` e pasta `/ (root)`.

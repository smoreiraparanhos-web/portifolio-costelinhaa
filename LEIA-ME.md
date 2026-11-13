# Portfólio — Samuel Paranhos

Site estático em HTML, CSS e JavaScript, sem dependências, pronto para o GitHub Pages.

## Estrutura

```
index.html                      conteúdo, em seis seções: apresentação, projetos, soluções, processo, sobre e contato
css/estilo.css                  apresentação (cores, fontes e medidas no topo, em :root)
js/dados.js                     ← EDITE AQUI: WhatsApp e e-mail
js/principal.js                 comportamento: entrada das seções, doca, sequências de telas, seletor da Maré, contato
assets/projetos/<projeto>/      capturas reais (WebP) geradas pelo script
assets/img/                     ícone da aba e imagem de compartilhamento
ferramentas/capturar-telas.mjs  gera as capturas a partir de cópias locais dos projetos
robots.txt, sitemap.xml         para os buscadores
```

## Ver no computador

```
python3 -m http.server 8000
```

Depois abra `http://localhost:8000`.

## Editar

- **Contato:** em `js/dados.js`. O botão do WhatsApp, as linhas de contato e o destino do formulário saem desses dados. Ao trocar, atualize também o `<noscript>` da seção de contato no `index.html`.
- **Formulário:** não envia nada sozinho. Ele monta a mensagem e abre o WhatsApp para a pessoa conferir e enviar.
- **Projeto:** cada `<article class="sala">` no `index.html` tem a condição do projeto (cliente real, estudo, demonstração), nome, resumo, link, o palco com três capturas e o estudo de caso (desafio, o que foi construído, resultado), com uma demonstração interativa ao lado.
- **Novo projeto:** copie um `article.sala`, troque textos e capturas e crie uma classe `sala--nome` em `css/estilo.css` com as cores do projeto. Descreva a condição real do projeto e não inclua resultados que não possam ser comprovados.
- **Cores e fontes:** no topo de `css/estilo.css`.
- **Depois de mudar CSS ou JS:** troque o número `?v=` nos três links do `index.html`, para o navegador não usar a versão antiga.

## Capturas

As capturas mostram as interfaces reais. O script serve os projetos em `localhost`: a Rodrigues TheBarber usa a própria agenda simulada e nenhum pedido de teste chega à barbearia. Endereços externos ficam bloqueados (exceto as fontes do Google). Nas capturas do estudo BM Digital, telefone e endereço da loja ficam ocultos, porque o estudo não tem vínculo com ela.

```
git clone https://github.com/smoreiraparanhos-web/rodriguesthebarber ../rodriguesthebarber
git clone https://github.com/smoreiraparanhos-web/mare-de-essencias ../mare-de-essencias
git clone https://github.com/smoreiraparanhos-web/eletr-nicos-perfumes ../eletr-nicos-perfumes
npm install --no-save playwright
npx playwright install chromium
node ferramentas/capturar-telas.mjs
```

Para refazer só um projeto: `SO=bm node ferramentas/capturar-telas.mjs` (`rodrigues`, `mare` ou `bm`).

A conversão para WebP usa Python com Pillow (`pip install pillow`). Confira as imagens antes de publicar: nenhuma pode mostrar dados de clientes nem o painel interno.

## Sistema visual (resumo)

- **Conceito:** a porta. Na apresentação, uma porta entreaberta deixa escapar a luz e as chaves levam às seções; cada projeto é uma sala com as cores do próprio projeto.
- **Cor:** preto e branco como base. O roxo é a luz (porta, destaques, foco); o vermelho é reservado à ação de contato.
- **Tipografia:** Fraunces nos títulos, Schibsted Grotesk no texto e Space Mono só em legendas curtas.
- **Forma:** cantos retos, fios finos e espaço. Curvas só nas chaves e nas molduras de celular.
- **Movimento:** a porta se abre na chegada, as chaves balançam ao passar o mouse e as seções entram suavemente. Tudo é desativado com “reduzir movimento”.

## Publicar no GitHub Pages

Em **Settings → Pages**, escolha **Deploy from a branch**, branch `main` e pasta `/ (root)`.

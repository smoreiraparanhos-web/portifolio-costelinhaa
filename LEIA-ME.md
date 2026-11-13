# Portfólio — Samuel Paranhos

Site estático em HTML, CSS e JavaScript, sem dependências, pronto para o GitHub Pages.

## Estrutura

```
index.html                      conteúdo: início, sobre, habilidades, projetos, serviços (com o processo) e contato
css/estilo.css                  apresentação (cores, fonte e medidas no topo, em :root)
js/dados.js                     ← EDITE AQUI: WhatsApp, e-mail e GitHub
js/principal.js                 comportamento: menu do celular, seção atual no menu, contato e formulário
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

- **Contato:** em `js/dados.js`. O botão do WhatsApp, a lista "Onde me encontrar" e o destino do formulário saem desses dados. Ao trocar, atualize também o `<noscript>` da seção de contato no `index.html`.
- **Formulário:** não envia nada sozinho. Ele monta a mensagem e abre o WhatsApp para a pessoa conferir e enviar.
- **Projeto:** cada `<li class="projeto">` tem a imagem, a condição do projeto (cliente real, estudo, teste), nome, resumo, dois destaques e o link. Descreva a condição real e não inclua resultados que não possam ser comprovados.
- **Habilidades:** cada barra mostra em quantos projetos publicados o item foi usado (`--n`, de 0 a 3). Ao publicar um projeto novo, revise os números e o divisor em `.barras i::after`, no CSS.
- **Fatos do "Sobre":** só informações verificáveis. Revise ao publicar um projeto novo.
- **Cores e fonte:** no topo de `css/estilo.css`.
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

Para refazer só um projeto: `SO=bm node ferramentas/capturar-telas.mjs` (`rodrigues`, `mare` ou `bm`). A página usa só a captura `abertura-computador` de cada projeto; as demais ficam disponíveis para uso futuro.

A conversão para WebP usa Python com Pillow (`pip install pillow`). Confira as imagens antes de publicar: nenhuma pode mostrar dados de clientes nem o painel interno.

## Sistema visual (resumo)

- **Estilo:** escuro, com barra fixa no topo, apresentação pessoal e seções em cartões.
- **Porta-chaves:** a assinatura do portfólio. Na apresentação, uma placa de metal com as iniciais gravadas segura quatro chaves de formatos diferentes; cada uma leva a uma seção e responde ao mouse e ao foco.
- **Cor:** roxo como cor principal (botões, destaques, ícones) e vermelho como segunda cor (botão "Fale comigo", WhatsApp, cliente real). O nome e as barras usam o degradê do roxo para o vermelho.
- **Tipografia:** Plus Jakarta Sans no texto e Space Mono nas etiquetas do porta-chaves.
- **Movimento:** as chaves balançam ao passar o mouse e os cartões de projeto sobem ao passar o mouse. Tudo é desativado com “reduzir movimento”.

## Publicar no GitHub Pages

Em **Settings → Pages**, escolha **Deploy from a branch**, branch `main` e pasta `/ (root)`.

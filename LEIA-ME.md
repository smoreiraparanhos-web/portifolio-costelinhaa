# Portfólio — Samuel Moreira Paranhos

Site estático em HTML, CSS e JavaScript, sem dependências e pronto para o GitHub Pages.

## Estrutura

```
index.html                 conteúdo e estrutura da página
css/estilo.css             visual (cores e fontes ficam no topo, em :root)
js/dados.js                ← EDITE AQUI: contatos, projetos, telas e recortes
js/principal.js            interações (menu, galeria, telas, contato)
assets/img/favicon.svg     ícone da aba
assets/capturas/           capturas de tela dos projetos (geradas pelo script)
ferramentas/capturar-telas.mjs   script que gera as capturas
```

## Ver no computador

Abra a pasta num terminal e rode `python -m http.server 8000`. Depois, acesse `http://localhost:8000`.
Abrir o `index.html` com dois cliques também funciona, mas o servidor local se comporta igual ao site publicado.

## Editar

- **Contatos:** em `js/dados.js`, preencha `contato.whatsapp` (só números, com 55 e DDD), `contato.email` e/ou `contato.instagram`. Os botões de envio e os links do rodapé aparecem sozinhos. Enquanto estiverem vazios, a página mostra só a opção de copiar a mensagem e avisa que os canais vêm em breve.
- **Projetos:** cada projeto é um bloco em `projetos`. Para publicar a Camisa em Campo, preencha os campos dela, crie as telas em `vistas` e mude `publicar` para `true`.
- **Telas:** cada item de `vistas` aponta para uma seção real de um site (`url` com `#âncora`).
- **Cores e fontes:** no topo de `css/estilo.css`.

## Capturas de tela (recomendado antes de publicar)

Sem capturas, as molduras carregam os sites reais ao vivo (iframes), sob demanda. Funciona, mas pesa mais.
Com as capturas, a página fica mais leve e as imagens não mudam sem você saber.

```
npm install --no-save playwright
npx playwright install chromium
node ferramentas/capturar-telas.mjs
```

As imagens vão para `assets/capturas/`, e a página passa a usá-las automaticamente. Confira cada uma antes de publicar: nenhuma deve mostrar dados de clientes.

## Publicar no GitHub Pages

1. Crie um repositório (por exemplo, `portfolio`) e envie todos os arquivos desta pasta.
2. Em **Settings → Pages**, escolha **Deploy from a branch**, branch `main`, pasta `/ (root)`.
3. Em alguns minutos, o site fica em `https://smoreiraparanhos-web.github.io/portfolio/`.

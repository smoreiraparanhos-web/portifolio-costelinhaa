/*
  DADOS DO PORTFÓLIO — edite aqui.
  Tudo o que muda com frequência (contatos, projetos, telas) fica neste arquivo.
  O restante da página lê estas informações automaticamente.
*/
(function () {
  var RODRIGUES = 'https://smoreiraparanhos-web.github.io/rodriguesthebarber/';
  var MARE = 'https://smoreiraparanhos-web.github.io/mare-de-essencias/';

  window.PORTFOLIO = {
    /* ---------------------------------------------------------------
       CONTATO
       Preencha apenas os canais que você quer publicar.
       Deixe '' (vazio) para não exibir.
       whatsapp: só números, com DDI e DDD. Ex.: '5551999999999'
       email:    ex.: 'contato@seudominio.com.br'
       instagram: só o usuário, sem @. Ex.: 'seuusuario'
    ---------------------------------------------------------------- */
    contato: {
      whatsapp: '',
      email: '',
      instagram: '',
      // Texto que abre a mensagem montada no formulário de contato.
      saudacao: 'Olá, Samuel! Vim pelo seu portfólio.'
    },

    /* ---------------------------------------------------------------
       TELAS (vistas)
       Cada tela mostra uma parte real de um projeto.
       - url: endereço público (com #âncora da seção, quando houver).
       - formato: 'desktop' (1280 px de largura) ou 'celular' (390 px).
       - captura: caminho de uma imagem gerada com o script
         ferramentas/capturar-telas.mjs. Se a imagem existir, ela é usada.
         Se não existir, a página mostra o site real ao vivo (iframe).
       - fundo: foto real do projeto exibida enquanto a tela carrega.
    ---------------------------------------------------------------- */
    vistas: {
      'rodrigues-inicio-desktop': {
        url: RODRIGUES + '#inicio', formato: 'desktop',
        captura: 'assets/capturas/rodrigues-inicio-desktop.jpg',
        fundo: RODRIGUES + 'img/tiago-retrato-900.webp',
        titulo: 'Rodrigues TheBarber — abertura do site no computador'
      },
      'rodrigues-inicio-celular': {
        url: RODRIGUES + '#inicio', formato: 'celular',
        captura: 'assets/capturas/rodrigues-inicio-celular.jpg',
        fundo: RODRIGUES + 'img/tiago-retrato-900.webp',
        titulo: 'Rodrigues TheBarber — abertura do site no celular'
      },
      'rodrigues-precos-celular': {
        url: RODRIGUES + '#precos', formato: 'celular',
        captura: 'assets/capturas/rodrigues-precos-celular.jpg',
        fundo: RODRIGUES + 'img/estampa-barbeiro.webp',
        titulo: 'Rodrigues TheBarber — tabela de preços no celular'
      },
      'rodrigues-agendar-celular': {
        url: RODRIGUES + '#agendar', formato: 'celular',
        captura: 'assets/capturas/rodrigues-agendar-celular.jpg',
        fundo: RODRIGUES + 'img/estampa-barbeiro.webp',
        titulo: 'Rodrigues TheBarber — formulário de solicitação de horário'
      },
      'rodrigues-endereco-desktop': {
        url: RODRIGUES + '#endereco', formato: 'desktop',
        captura: 'assets/capturas/rodrigues-endereco-desktop.jpg',
        fundo: RODRIGUES + 'img/estampa-barbeiro.webp',
        titulo: 'Rodrigues TheBarber — endereço, horários e mapa'
      },
      'rodrigues-avaliacoes-celular': {
        url: RODRIGUES + '#avaliacoes', formato: 'celular',
        captura: 'assets/capturas/rodrigues-avaliacoes-celular.jpg',
        fundo: RODRIGUES + 'img/estampa-barbeiro.webp',
        titulo: 'Rodrigues TheBarber — avaliações com link para o Google'
      },
      'mare-topo-celular': {
        url: MARE + '#topo', formato: 'celular',
        captura: 'assets/capturas/mare-topo-celular.jpg',
        fundo: MARE + 'assets/fundos/marmore-arco.webp',
        titulo: 'Maré de Essências — abertura no celular'
      },
      'mare-topo-desktop': {
        url: MARE + '#topo', formato: 'desktop',
        captura: 'assets/capturas/mare-topo-desktop.jpg',
        fundo: MARE + 'assets/fundos/marmore-arco.webp',
        titulo: 'Maré de Essências — abertura no computador'
      },
      'mare-mare-celular': {
        url: MARE + '#mare', formato: 'celular',
        captura: 'assets/capturas/mare-mare-celular.jpg',
        fundo: MARE + 'assets/fundos/flor-copo-de-leite.webp',
        titulo: 'Maré de Essências — seletor “Qual maré combina com você?”'
      },
      'mare-guia-desktop': {
        url: MARE + '#guia', formato: 'desktop',
        captura: 'assets/capturas/mare-guia-desktop.jpg',
        fundo: MARE + 'assets/fundos/ambar.webp',
        titulo: 'Maré de Essências — guia “Como escolher o seu perfume”'
      },
      'mare-colecoes-celular': {
        url: MARE + '#colecoes', formato: 'celular',
        captura: 'assets/capturas/mare-colecoes-celular.jpg',
        fundo: MARE + 'assets/fundos/limao-descascado.webp',
        titulo: 'Maré de Essências — coleções por estilo no celular'
      }
    },

    /* ---------------------------------------------------------------
       FOTOS reais usadas nos projetos (hospedadas nos próprios sites).
    ---------------------------------------------------------------- */
    fotos: {
      'rodrigues-corte': { src: RODRIGUES + 'img/corte-08-900.webp', alt: 'Corte de cabelo masculino fotografado logo depois do atendimento na Rodrigues TheBarber', w: 900, h: 1125 },
      'rodrigues-tiago': { src: RODRIGUES + 'img/tiago-retrato-900.webp', alt: 'Retrato do barbeiro Tiago usado na abertura do site', w: 900, h: 1125 },
      'mare-limao': { src: MARE + 'assets/fundos/limao-descascado.webp', alt: 'Casca de limão, imagem da família olfativa Frescos', w: 800, h: 1000 },
      'mare-flor': { src: MARE + 'assets/fundos/flor-copo-de-leite.webp', alt: 'Flor copo-de-leite, imagem da família olfativa Florais', w: 800, h: 1000 },
      'mare-marmore': { src: MARE + 'assets/fundos/marmore-arco.webp', alt: 'Arco de mármore, imagem da família olfativa Amadeirados', w: 800, h: 1000 },
      'mare-ambar': { src: MARE + 'assets/fundos/ambar.webp', alt: 'Pedra de âmbar, imagem da família olfativa Orientais', w: 800, h: 1000 }
    },

    /* ---------------------------------------------------------------
       PROJETOS
       status: 'cliente' | 'apresentacao' | 'estudo' | 'demonstracao'
       publicar: false esconde o projeto da página.
    ---------------------------------------------------------------- */
    projetos: [
      {
        id: 'rodrigues',
        publicar: true,
        nome: 'Rodrigues TheBarber',
        negocio: 'Barbearia em Eldorado do Sul, RS',
        status: 'cliente',
        rotuloStatus: 'Projeto para cliente',
        url: RODRIGUES,
        urlTexto: 'smoreiraparanhos-web.github.io/rodriguesthebarber',
        composicao: 'ampla',
        vistas: ['rodrigues-inicio-desktop', 'rodrigues-inicio-celular'],
        objetivo: 'Apresentar a barbearia do Tiago, mostrar cortes e preços com clareza e levar o visitante até a solicitação de horário sem rodeios.',
        desenvolvi: [
          'Página única com abertura, tabela de preços, galeria de cortes, apresentação do barbeiro, avaliações e localização.',
          'Formulário para solicitar horário com serviço, dia e horário, nome e WhatsApp.',
          'Galeria com fotos reais dos clientes, que ampliam ao toque.',
          'Bloco de endereço com horários, mapa e rota pelo Google Maps.',
          'Participação no trabalho de agendamento e painel administrativo da barbearia. As áreas internas não aparecem aqui, para proteger os dados dos clientes.'
        ],
        decisoes: [
          'O botão “Agendar horário” fica no topo e volta a aparecer ao longo da página.',
          'Os preços estão separados por categoria: cortes, barba, pigmentação, luzes e combo.',
          'As fotos são dos cortes feitos na própria cadeira, não imagens genéricas.',
          'Um aviso de privacidade explica, ao lado do formulário, quem recebe os dados.'
        ]
      },
      {
        id: 'mare',
        publicar: true,
        nome: 'Maré de Essências',
        negocio: 'Perfumaria com curadoria',
        status: 'apresentacao',
        rotuloStatus: 'Site em fase de apresentação',
        url: MARE,
        urlTexto: 'smoreiraparanhos-web.github.io/mare-de-essencias',
        composicao: 'celulares',
        vistas: ['mare-topo-celular', 'mare-mare-celular', 'mare-topo-desktop'],
        objetivo: 'Apresentar uma perfumaria com curadoria e ajudar quem não entende de perfume a descobrir por onde começar.',
        desenvolvi: [
          'Abertura com dois caminhos: ver os perfumes ou descobrir a “maré” de cada pessoa.',
          'Navegação por famílias olfativas — frescos, florais, amadeirados e orientais — com fotos que sugerem cada cheiro.',
          'Seletor interativo em que o frasco muda de cor conforme a intensidade escolhida.',
          'Guia “Como escolher o seu perfume”, com a pirâmide olfativa e os tipos de concentração.',
          'Lista “Minha seleção” para guardar favoritos e escolher com calma.'
        ],
        decisoes: [
          'O visitante começa pelo que gosta de sentir, e não por termos técnicos.',
          'Eau de Toilette, Eau de Parfum e Extrait são explicados em linguagem simples.',
          'O próprio site avisa que ainda não faz vendas, pedidos nem pagamentos.'
        ]
      },
      {
        id: 'camisa-em-campo',
        publicar: false, // mude para true quando houver link e capturas reais
        nome: 'Camisa em Campo',
        negocio: 'Loja online de camisetas de futebol',
        status: '',
        rotuloStatus: '',
        url: '',
        urlTexto: '',
        composicao: 'ampla',
        vistas: [],
        objetivo: '',
        desenvolvi: [],
        decisoes: []
      }
    ],

    /* ---------------------------------------------------------------
       DETALHES — recortes usados como evidência na seção
       “Detalhes do meu trabalho”. tipo: 'vista' ou 'foto'.
    ---------------------------------------------------------------- */
    detalhes: [
      { tipo: 'vista', ref: 'mare-mare-celular', tamanho: 'alto', titulo: 'Interação que explica', texto: 'Na Maré de Essências, arrastar o seletor muda a cor do frasco e mostra notas como jasmim e flor de laranjeira. A pessoa entende intensidade sem precisar de vocabulário técnico.' },
      { tipo: 'fotos', refs: ['mare-limao', 'mare-flor', 'mare-marmore', 'mare-ambar'], tamanho: 'largo', titulo: 'Imagens que traduzem cheiro', texto: 'Cada família olfativa ganhou uma foto que lembra o aroma: casca de limão, copo-de-leite, mármore e âmbar. É um atalho visual para quem não sabe o nome do que procura.' },
      { tipo: 'vista', ref: 'rodrigues-avaliacoes-celular', tamanho: 'alto', titulo: 'Avaliação com a fonte', texto: 'As avaliações da barbearia vêm com um link para ler todas no Google. Quem visita pode conferir por conta própria.' },
      { tipo: 'vista', ref: 'mare-guia-desktop', tamanho: 'largo', titulo: 'Termo técnico, explicação simples', texto: 'O guia apresenta saída, coração e fundo, e diferencia Eau de Cologne, Eau de Toilette, Eau de Parfum e Extrait em frases curtas.' },
      { tipo: 'foto', ref: 'rodrigues-corte', tamanho: 'medio', titulo: 'O serviço como vitrine', texto: 'Em vez de banco de imagens, a galeria mostra cortes feitos na própria cadeira, fotografados logo depois do atendimento.' },
      { tipo: 'vista', ref: 'mare-colecoes-celular', tamanho: 'medio', titulo: 'Leitura no celular', texto: 'As coleções viram abas por estilo — masculinos, femininos, unissex, árabes e nicho — com textos curtos que cabem na tela pequena.' }
    ]
  };
})();

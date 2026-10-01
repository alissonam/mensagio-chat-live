# Chat ao Vivo - Mensagio Tecnologia

Chat multi-usuário em tempo real para o minicurso.

Stack mínima: **Node.js + Express + Socket.io**

## Como rodar

```bash
npm install
npm start
```

Acesse: http://localhost:3000

## Funcionalidades

- Mensagens em tempo real para todos os participantes.
- Emojis: painel de emojis para inserir na mensagem.
- Curtidas: o contador é sincronizado entre todos via Socket.io (evento `like`).

## Expor para a sala (ngrok)

```bash
ngrok http 3000
```

Copiar URL correspondente após exposição.

## Estrutura

```
mensagio-chat-live/
├── server.js
├── public/
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── app.js
├── package.json
└── README.md
```

### Responsabilidade de cada camada

- `index.html`: estrutura e conteúdo da interface.
- `css/style.css`: estilos e apresentação visual.
- `js/app.js`: comportamento da interface e comunicação com Socket.io.
- `server.js`: servidor HTTP e comunicação em tempo real.

## Autor

Mensagio Tecnologia - Minicurso

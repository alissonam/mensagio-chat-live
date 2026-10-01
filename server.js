const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Disponibiliza os arquivos estáticos da pasta public.
app.use(express.static(path.join(__dirname, "public")));

// Identificador das mensagens e controle de curtidas (id da mensagem -> sockets que curtiram).
let nextMessageId = 1;
const likes = new Map();

// Gerencia as conexões e retransmite as mensagens recebidas.
io.on("connection", (socket) => {
  console.log("Novo usuário conectado:", socket.id);

  // Recebe uma mensagem e envia para todos os clientes conectados.
  socket.on("message", (data) => {
    io.emit("message", { ...data, id: nextMessageId++ });
  });

  // Alterna a curtida do usuário e informa o total atualizado a todos.
  socket.on("like", (id) => {
    const likedBy = likes.get(id) || new Set();
    const liked = !likedBy.has(socket.id);

    if (liked) {
      likedBy.add(socket.id);
    } else {
      likedBy.delete(socket.id);
    }

    likes.set(id, likedBy);
    io.emit("like", { id, count: likedBy.size, by: socket.id, liked });
  });

  socket.on("disconnect", () => {
    console.log("Usuário saiu:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Chat ao Vivo rodando em http://localhost:${PORT}`);
});

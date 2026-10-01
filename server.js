const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Disponibiliza os arquivos estáticos da pasta public.
app.use(express.static(path.join(__dirname, "public")));

// Gerencia as conexões e retransmite as mensagens recebidas.
io.on("connection", (socket) => {
  console.log("Novo usuário conectado:", socket.id);

  // Recebe uma mensagem e envia para todos os clientes conectados.
  socket.on("message", (data) => {
    io.emit("message", data);
  });

  socket.on("disconnect", () => {
    console.log("Usuário saiu:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Chat ao Vivo rodando em http://localhost:${PORT}`);
});

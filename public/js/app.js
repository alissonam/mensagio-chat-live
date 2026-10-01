const socket = io();

const loginScreen = document.getElementById("login-screen");
const chatScreen = document.getElementById("chat-screen");
const nameInput = document.getElementById("name-input");
const enterButton = document.getElementById("enter-button");
const userName = document.getElementById("user-name");
const logoutButton = document.getElementById("logout-button");
const messageList = document.getElementById("message-list");
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");
const connectionStatus = document.getElementById("connection-status");
const statusText = document.getElementById("status-text");
const emojiButton = document.getElementById("emoji-button");
const emojiPanel = document.getElementById("emoji-panel");

let currentUser = null;
const likedByMe = new Set();

// Atualiza a interface quando a conexão com o servidor é estabelecida.
socket.on("connect", () => {
  connectionStatus.classList.remove("offline");
  statusText.textContent = "Conectado";
});

// Informa visualmente quando o cliente perde a conexão.
socket.on("disconnect", () => {
  connectionStatus.classList.add("offline");
  statusText.textContent = "Desconectado";
});

// Recebe mensagens enviadas por qualquer participante.
socket.on("message", (data) => {
  addMessage(
    data.user,
    data.text,
    data.time,
    data.user === currentUser,
    data.id
  );
});

// Recebe o total de curtidas de uma mensagem, definido pelo servidor.
socket.on("like", (data) => {
  if (data.by === socket.id) {
    if (data.liked) {
      likedByMe.add(data.id);
    } else {
      likedByMe.delete(data.id);
    }
  }

  updateLikeButton(data.id, data.count);
});

function formatTime() {
  return new Date().toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Escapa o conteúdo antes de inseri-lo como HTML.
function escapeText(text) {
  const element = document.createElement("div");
  element.textContent = text;
  return element.innerHTML;
}

// Cria a mensagem e mantém a lista posicionada na mensagem mais recente.
function addMessage(user, text, time, isOwnMessage, id) {
  const messageElement = document.createElement("div");
  messageElement.className = `message ${isOwnMessage ? "own" : "other"}`;

  messageElement.innerHTML =
    `<div class="info">${escapeText(user)} • ${escapeText(time)}</div>` +
    `<div>${escapeText(text)}</div>` +
    `<button class="like-button" data-id="${id}">🤍</button>`;

  messageList.appendChild(messageElement);
  messageList.scrollTop = messageList.scrollHeight;
}

// Atualiza o ícone e o contador de curtidas de uma mensagem.
function updateLikeButton(id, count) {
  const button = messageList.querySelector(`.like-button[data-id="${id}"]`);

  if (!button) {
    return;
  }

  const icon = likedByMe.has(id) ? "❤️" : "🤍";
  button.textContent = count > 0 ? `${icon} ${count}` : icon;
}

function enterChat() {
  const name = nameInput.value.trim();

  if (name.length < 2) {
    alert("Digite um nome com pelo menos 2 caracteres");
    return;
  }

  currentUser = name;
  userName.textContent = currentUser;

  loginScreen.classList.add("hidden");
  chatScreen.classList.remove("hidden");

  messageInput.focus();
}

function sendMessage() {
  const text = messageInput.value.trim();

  if (!text || !currentUser) {
    return;
  }

  const data = {
    user: currentUser,
    text: text,
    time: formatTime(),
  };

  socket.emit("message", data);

  messageInput.value = "";
  emojiPanel.classList.add("hidden");
  messageInput.focus();
}

enterButton.addEventListener("click", enterChat);
sendButton.addEventListener("click", sendMessage);
logoutButton.addEventListener("click", () => location.reload());

// Mostra ou esconde o painel de emojis.
emojiButton.addEventListener("click", () => {
  emojiPanel.classList.toggle("hidden");
});

// Insere o emoji clicado no campo de mensagem.
emojiPanel.addEventListener("click", (event) => {
  if (event.target.tagName === "SPAN") {
    messageInput.value += event.target.textContent;
    messageInput.focus();
  }
});

// Envia ao servidor o pedido de curtir/descurtir uma mensagem.
messageList.addEventListener("click", (event) => {
  const button = event.target.closest(".like-button");

  if (button) {
    socket.emit("like", Number(button.dataset.id));
  }
});

nameInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    enterChat();
  }
});

messageInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    sendMessage();
  }
});

nameInput.focus();

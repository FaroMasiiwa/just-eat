document.addEventListener("DOMContentLoaded", () => {
  const socket = io(); 
  const chatDiv = document.getElementById("chat");
  const input = document.getElementById("input");
  const sessionId = Date.now().toString();

  function appendMessage(msg, sender = "bot") {
    const msgDiv = document.createElement("div");
    msgDiv.className = sender === "bot" ? "message bot" : "message user";
    msgDiv.innerHTML = msg; 
    chatDiv.appendChild(msgDiv);
    chatDiv.scrollTop = chatDiv.scrollHeight;
  }

  window.sendMessage = function() {
    const message = input.value.trim();
    if (!message) return;
    appendMessage(`You: ${message}`, "user");
    socket.emit("message", { sessionId, message });
    input.value = "";
  };
  
  /* Listen for payment success from server and show a bot message with the URL */
socket.on('payment_success', (data) => {
    const url = (data && data.url) ? String(data.url) : '';
    if (!url) {
        addMessage('bot', 'Payment successful.');
        return;
    }
    // Basic safe link rendering
    const safeUrl = escapeHtml(url);
    addMessage('bot', `Payment successful — <a href="${safeUrl}" target="_blank" rel="noopener noreferrer">Open receipt</a>`);
});

/* small helper to prevent simple HTML injection */
function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
}

  socket.on("botMessage", (msg) => appendMessage(`Bot: ${msg}`, "bot"));

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
  });
});

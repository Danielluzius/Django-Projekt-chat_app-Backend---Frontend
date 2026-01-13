const API_URL = 'http://127.0.0.1:8000/api/chat/messages/';

async function loadMessages() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    const chatBox = document.getElementById('chatBox');
    chatBox.innerHTML = '';

    data.messages.forEach((msg) => {
      const messageDiv = document.createElement('div');
      messageDiv.className = 'message';

      const date = new Date(msg.created_at);
      const timeString = date.toLocaleString('de-DE');

      messageDiv.innerHTML = `
                <div class="message-name">${msg.name}</div>
                <div class="message-text">${msg.message}</div>
                <div class="message-time">${timeString}</div>
            `;

      chatBox.appendChild(messageDiv);
    });

    chatBox.scrollTop = chatBox.scrollHeight;
  } catch (error) {
    console.error('Fehler beim Laden:', error);
  }
}

async function sendMessage(name, message) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, message }),
    });

    if (response.ok) {
      loadMessages();
    }
  } catch (error) {
    console.error('Fehler beim Senden:', error);
  }
}

document.getElementById('messageForm').addEventListener('submit', (e) => {
  e.preventDefault();

  const nameInput = document.getElementById('nameInput');
  const messageInput = document.getElementById('messageInput');

  const name = nameInput.value.trim();
  const message = messageInput.value.trim();

  if (name && message) {
    sendMessage(name, message);
    messageInput.value = '';
  }
});

loadMessages();

setInterval(loadMessages, 3000);

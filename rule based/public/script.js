const form = document.getElementById("chat-form");
const input = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");
const messagesContainer = document.getElementById("messages-container");
const clearButton = document.getElementById("clear-chat");

// Auto-resize textarea
input.addEventListener("input", function () {
  this.style.height = "auto";
  this.style.height = (this.scrollHeight) + "px";
  
  if (this.value.trim().length > 0) {
    sendButton.removeAttribute("disabled");
  } else {
    sendButton.setAttribute("disabled", "true");
  }
});

// Handle Enter Key to Send
input.addEventListener("keydown", function(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    if (this.value.trim().length > 0) {
      form.dispatchEvent(new Event('submit'));
    }
  }
});

// Clear Chat
clearButton.addEventListener("click", () => {
  // Keep only the first welcome message
  const welcomeMessage = messagesContainer.firstElementChild;
  messagesContainer.innerHTML = '';
  if (welcomeMessage) {
    messagesContainer.appendChild(welcomeMessage);
  }
});

// Helper to Get Current Time
function getTimeStr() {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Format Text Helper
function formatText(text) {
  // 1. Escape basic HTML tags for safety
  const tempDiv = document.createElement("div");
  tempDiv.textContent = text;
  let sanitized = tempDiv.innerHTML;

  // 2. Parse basic markdown **bold** syntax to <strong>
  sanitized = sanitized.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  return sanitized;
}

// Add Message to Chat
function appendMessage(text, sender) {
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${sender}-message slide-in`;

  const avatarDiv = document.createElement("div");
  avatarDiv.className = `avatar ${sender}-avatar`;
  
  // Decide icon based on user or bot
  const icon = document.createElement("i");
  if (sender === "bot") {
    icon.className = "fa-solid fa-robot";
  } else {
    icon.className = "fa-solid fa-user";
  }
  avatarDiv.appendChild(icon);

  const contentDiv = document.createElement("div");
  contentDiv.className = "message-content";

  const textP = document.createElement("p");
  textP.innerHTML = formatText(text);

  const timeSpan = document.createElement("span");
  timeSpan.className = "timestamp";
  timeSpan.textContent = getTimeStr();

  contentDiv.appendChild(textP);
  contentDiv.appendChild(timeSpan);

  // Layout order depends on sender
  if (sender === "user") {
    messageDiv.appendChild(contentDiv);
    messageDiv.appendChild(avatarDiv);
  } else {
    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(contentDiv);
  }

  messagesContainer.appendChild(messageDiv);
  scrollToBottom();
}

// Handle Form Submit
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const userMessage = input.value.trim();
  if (!userMessage) return;

  // 1. Display User Message
  appendMessage(userMessage, "user");

  // Reset input
  input.value = "";
  input.style.height = "auto";
  sendButton.setAttribute("disabled", "true");
  input.focus();

  // 2. Add Typing Indicator
  const typingIndicator = showTypingIndicator();
  
  try {
    // Artificial delay to make it feel human (500 - 1500ms)
    const delay = Math.floor(Math.random() * 1000) + 500;
    await new Promise(r => setTimeout(r, delay));

    // 3. Send to Backend
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: userMessage }),
    });

    const data = await response.json();
    
    // Remove Typing Indicator
    typingIndicator.remove();

    // 4. Display Bot Reply
    if (data.reply) {
      appendMessage(data.reply, "bot");
    } else {
      appendMessage("Error: Did not receive a valid reply.", "bot");
    }
    
  } catch (error) {
    console.error("Chat error:", error);
    typingIndicator.remove();
    appendMessage("Sorry, I'm having trouble connecting to the server.", "bot");
  }
});

// Show Typing Indicator
function showTypingIndicator() {
  const wrapperDiv = document.createElement("div");
  wrapperDiv.className = "message bot-message slide-in";
  wrapperDiv.id = "typing-indicator-wrapper";

  const avatarDiv = document.createElement("div");
  avatarDiv.className = "avatar bot-avatar";
  avatarDiv.innerHTML = '<i class="fa-solid fa-robot"></i>';

  const contentDiv = document.createElement("div");
  contentDiv.className = "message-content";

  const indicatorDiv = document.createElement("div");
  indicatorDiv.className = "typing-indicator";
  for(let i=0; i<3; i++) {
    const dot = document.createElement("div");
    dot.className = "typing-dot";
    indicatorDiv.appendChild(dot);
  }

  contentDiv.appendChild(indicatorDiv);
  wrapperDiv.appendChild(avatarDiv);
  wrapperDiv.appendChild(contentDiv);

  messagesContainer.appendChild(wrapperDiv);
  scrollToBottom();

  return wrapperDiv;
}

// Scroll to Bottom
function scrollToBottom() {
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Sidebar Interactions
window.useSuggestion = function(text) {
  input.value = text;
  input.style.height = "auto";
  sendButton.removeAttribute("disabled");
  input.focus();
};

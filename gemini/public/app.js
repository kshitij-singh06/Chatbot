const messagesEl = document.getElementById('messages');
const inputEl = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const clearChatBtn = document.getElementById('clearChatBtn');
const statusEl = document.getElementById('status');

/* ── Markdown rendering ────────────────────────────── */

marked.setOptions({ breaks: true, gfm: true });

function renderMarkdown(text) {
  return DOMPurify.sanitize(marked.parse(text));
}

/* ── Helpers ────────────────────────────────────────── */

function formatTime(date = new Date()) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function scrollToBottom() {
  messagesEl.scrollTo({ top: messagesEl.scrollHeight, behavior: 'smooth' });
}

function createTypingDots() {
  const dots = document.createElement('span');
  dots.className = 'dots';
  dots.setAttribute('aria-label', 'Typing');
  dots.innerHTML = '<span></span><span></span><span></span>';
  return dots;
}

/* ── Auto-resize textarea ──────────────────────────── */

function autoResize() {
  inputEl.style.height = 'auto';
  inputEl.style.height = Math.min(inputEl.scrollHeight, 140) + 'px';
}

/* ── Copy button helper ────────────────────────────── */

function createCopyButton(getRawText) {
  const btn = document.createElement('button');
  btn.className = 'copy-btn';
  btn.textContent = '📋 Copy';
  btn.addEventListener('click', () => {
    const text = typeof getRawText === 'function' ? getRawText() : getRawText;
    navigator.clipboard.writeText(text).then(() => {
      btn.textContent = '✓ Copied';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = '📋 Copy';
        btn.classList.remove('copied');
      }, 2000);
    });
  });
  return btn;
}

/* ── Message bubbles ───────────────────────────────── */

function addMessageBubble({ role, text, html, withMeta = true, withCopy = false }) {
  const bubble = document.createElement('div');
  bubble.className = `message ${role}`;

  const body = document.createElement('div');
  body.className = 'body';

  if (html) {
    body.innerHTML = html;
  } else {
    body.textContent = text;
  }

  bubble.appendChild(body);

  if (withCopy && role === 'bot') {
    const rawText = text || body.innerText;
    bubble.appendChild(createCopyButton(() => rawText));
  }

  if (withMeta) {
    const meta = document.createElement('span');
    meta.className = 'meta';
    meta.textContent = role === 'user'
      ? `You • ${formatTime()}`
      : `WellnessBot • ${formatTime()}`;
    bubble.appendChild(meta);
  }

  messagesEl.appendChild(bubble);
  scrollToBottom();
  return body;
}

function addTypingBubble() {
  const bodyEl = addMessageBubble({ role: 'bot', text: '', withMeta: false });
  bodyEl.classList.add('typing');
  bodyEl.replaceChildren(createTypingDots());
  return bodyEl;
}

function appendMeta(bubble) {
  if (!bubble.querySelector('.meta')) {
    const meta = document.createElement('span');
    meta.className = 'meta';
    meta.textContent = `WellnessBot • ${formatTime()}`;
    bubble.appendChild(meta);
  }
}

/* ── Suggested prompts ─────────────────────────────── */

const SUGGESTIONS = [
  { icon: '😴', text: 'Tips for better sleep' },
  { icon: '🥗', text: 'Healthy breakfast ideas' },
  { icon: '🧘', text: 'How to manage stress' },
  { icon: '🏋️', text: 'Simple home workout' },
  { icon: '🧠', text: 'Benefits of meditation' },
];

function renderSuggestions() {
  const container = document.createElement('div');
  container.className = 'suggestions';
  container.id = 'suggestions';

  SUGGESTIONS.forEach(({ icon, text }) => {
    const chip = document.createElement('button');
    chip.className = 'suggestion-chip';
    chip.innerHTML = `<span>${icon}</span> ${text}`;
    chip.addEventListener('click', () => {
      inputEl.value = text;
      autoResize();
      sendMessage();
    });
    container.appendChild(chip);
  });

  messagesEl.appendChild(container);
  scrollToBottom();
}

function removeSuggestions() {
  const el = document.getElementById('suggestions');
  if (el) el.remove();
}

/* ── SSE stream reader ─────────────────────────────── */

async function readStream(response, onChunk, onError) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop();

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const payload = line.slice(6);
      if (payload === '[DONE]') return;
      try {
        const data = JSON.parse(payload);
        if (data.error) { onError(data.error); return; }
        if (data.chunk) onChunk(data.chunk);
      } catch { /* ignore malformed */ }
    }
  }
}

/* ── Controls ──────────────────────────────────────── */

function setControlsDisabled(disabled) {
  sendBtn.disabled = disabled;
  inputEl.disabled = disabled;
  clearChatBtn.disabled = disabled;
}

/* ── Send message (streaming) ──────────────────────── */

async function sendMessage() {
  const message = inputEl.value.trim();
  if (!message) return;

  removeSuggestions();
  addMessageBubble({ role: 'user', text: message });
  inputEl.value = '';
  autoResize();
  inputEl.focus();

  setControlsDisabled(true);
  if (statusEl) statusEl.textContent = '';

  const botBodyEl = addTypingBubble();
  const bubble = botBodyEl.parentElement;

  try {
    const resp = await fetch('/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });

    const contentType = resp.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      const data = await resp.json().catch(() => ({}));
      const errText = data?.error || `Request failed (${resp.status})`;
      botBodyEl.classList.remove('typing');
      botBodyEl.textContent = errText;
      bubble.classList.add('error');
      appendMeta(bubble);
      return;
    }

    // Streaming SSE response
    let accumulated = '';
    botBodyEl.classList.remove('typing');

    await readStream(
      resp,
      (chunk) => {
        accumulated += chunk;
        botBodyEl.innerHTML = renderMarkdown(accumulated);
        scrollToBottom();
      },
      (error) => {
        botBodyEl.textContent = error;
        bubble.classList.add('error');
      }
    );

    // Add copy button after streaming completes
    if (accumulated && !bubble.querySelector('.copy-btn')) {
      const copyBtn = createCopyButton(() => accumulated);
      bubble.insertBefore(copyBtn, botBodyEl.nextSibling);
    }

    appendMeta(bubble);
  } catch (e) {
    botBodyEl.classList.remove('typing');
    botBodyEl.textContent = 'Network error. Please try again.';
    bubble.classList.add('error');
    appendMeta(bubble);
  } finally {
    if (statusEl) statusEl.textContent = '';
    setControlsDisabled(false);
    inputEl.focus();
  }
}

/* ── Clear chat ────────────────────────────────────── */

async function clearChat() {
  messagesEl.replaceChildren();
  showWelcome();
  try {
    await fetch('/clear', { method: 'POST' });
  } catch { /* ignore */ }
}


/* ── Welcome screen ────────────────────────────────── */

function showWelcome() {
  addMessageBubble({
    role: 'bot',
    html: renderMarkdown(
      '🌿 **Welcome to WellnessBot!**\n\n' +
      'I\'m your AI health & wellness companion. Ask me about:\n\n' +
      '- 🏋️ **Fitness** — workouts, exercises, routines\n' +
      '- 🥗 **Nutrition** — healthy eating, meal plans\n' +
      '- 🧘 **Mental Health** — stress, mindfulness, meditation\n' +
      '- 😴 **Sleep** — better rest, sleep hygiene\n' +
      '- 💊 **General Wellness** — healthy habits, lifestyle tips\n\n' +
      '*Note: I provide general wellness info, not medical advice. Always consult a healthcare professional for medical concerns.*'
    ),
    withMeta: false
  });
  renderSuggestions();
}

/* ── Event listeners ───────────────────────────────── */

sendBtn.addEventListener('click', sendMessage);
inputEl.addEventListener('input', autoResize);

inputEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

clearChatBtn.addEventListener('click', clearChat);

/* ── Boot ───────────────────────────────────────────── */

(function boot() {
  showWelcome();
})();

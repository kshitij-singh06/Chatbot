/**
 * Help / FAQ Rules
 */
module.exports = [
  {
    patterns: [/^help$/, /what can you do/, /what do you do/, /your features/],
    responses: [
      "I can help you with:\n• General questions & small talk\n• Academic topics (AI, ML, programming)\n• Fun facts & jokes\n• Basic greetings & conversations\n\nJust type your question! 😊",
    ],
  },
  {
    patterns: [/who (made|created|built|developed) you/, /who are you/, /what are you/],
    responses: [
      "I'm a rule-based chatbot 🤖 built with Node.js! I use pattern matching to understand your messages and provide relevant responses.",
      "I'm a simple yet smart chatbot! I was built using a rule-based approach with regular expressions and keyword matching.",
    ],
  },
  {
    patterns: [/your name/, /what('s| is) your name/],
    responses: [
      "I'm RuleBot — your friendly rule-based chatbot assistant! 🤖",
      "You can call me RuleBot! I'm here to help.",
    ],
  },
  {
    patterns: [/^commands$/, /^all commands$/, /^show commands$/, /^\/commands$/],
    responses: [
      "Here are the things you can ask me:\n\n**👋 Greetings:** 'Hi', 'Hello', 'How are you?'\n**🧠 AI / Docs:** 'What is AI?', 'Define ML', 'Explain deep learning', 'What is NLP?'\n**🤖 About Me:** 'Who are you?', 'What is a chatbot?', 'Rule-based vs AI'\n**💻 Programming:** 'What is Python?', 'What is programming?'\n**🎭 Fun:** 'Tell me a joke', 'Fun fact', 'I am bored'\n**❓ Help:** 'Help', 'Commands'\n\nTry asking any of these! 😊",
    ],
  },
];

/**
 * Greeting Rules
 */
module.exports = [
  {
    patterns: [
      /^hi!$/,
      /^hi$/,
      /^hello$/,
      /^hey$/,
      /^howdy$/,
      /^hola$/,
      /^yo$/,
      /^greetings$/,
      /^good\s*(morning|afternoon|evening)/,
      /^what'?s\s*up/,
      /^sup$/,
    ],
    responses: [
      "Hello! 👋 How can I help you today?",
      "Hey there! What can I do for you?",
      "Hi! I'm your chatbot assistant. Ask me anything!",
      "Greetings! 😊 How may I assist you?",
      "Hello! Nice to chat with you. What's on your mind?",
    ],
  },
  {
    patterns: [/how are you/, /how('re| are) you doing/, /how do you do/],
    responses: [
      "I'm doing great, thanks for asking! 😊 How can I help?",
      "I'm running smoothly! What can I do for you?",
      "All systems operational! 🤖 What do you need?",
      "I'm wonderful! Ready to assist you.",
    ],
  },
];

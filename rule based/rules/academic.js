/**
 * Academic / Knowledge Rules
 */
module.exports = [
  // Artificial Intelligence
  {
    patterns: [/what is (ai|artificial intelligence)/, /define (ai|artificial intelligence)/, /explain (ai|artificial intelligence)/],
    responses: [
      "Artificial Intelligence (AI) is the simulation of human intelligence by machines. It includes learning, reasoning, problem-solving, perception, and language understanding. 🧠",
      "AI refers to computer systems designed to perform tasks that normally require human intelligence — such as visual perception, speech recognition, decision-making, and translation.",
    ],
  },
  // Machine Learning
  {
    patterns: [/what is (ml|machine learning)/, /define (ml|machine learning)/, /explain (ml|machine learning)/],
    responses: [
      "Machine Learning (ML) is a subset of AI that enables systems to learn and improve from experience without being explicitly programmed. It uses algorithms to find patterns in data. 📊",
      "ML is a branch of AI focused on building systems that learn from data. Common types include supervised learning, unsupervised learning, and reinforcement learning.",
    ],
  },
  // Deep Learning
  {
    patterns: [/what is deep learning/, /define deep learning/, /explain deep learning/],
    responses: [
      "Deep Learning is a subset of Machine Learning that uses neural networks with many layers (hence 'deep'). It excels at tasks like image recognition, NLP, and speech processing. 🔬",
    ],
  },
  // NLP
  {
    patterns: [/what is (nlp|natural language processing)/, /define (nlp|natural language processing)/],
    responses: [
      "Natural Language Processing (NLP) is a field of AI that focuses on the interaction between computers and human language. It helps machines read, understand, and generate text. 📝",
    ],
  },
  // Chatbot
  {
    patterns: [/what is a chatbot/, /define chatbot/, /types of chatbot/],
    responses: [
      "A chatbot is a software application that simulates human conversation. There are two main types:\n• **Rule-based** — uses predefined patterns and responses (like me!)\n• **AI-based** — uses ML/NLP to generate dynamic responses.",
    ],
  },
  // Programming
  {
    patterns: [/what is (python|javascript|java|c\+\+|programming)/],
    responses: [
      "Programming is the process of creating instructions for computers to follow. Popular languages include Python, JavaScript, Java, and C++. Each has its own strengths and use cases! 💻",
    ],
  },
  // Rule-based vs AI-based
  {
    patterns: [/rule.?based vs ai/, /difference between rule.?based and ai/, /rule.?based chatbot/],
    responses: [
      "Great question! Here's the difference:\n\n**Rule-based chatbots** (like me 🤖):\n• Use predefined patterns & keyword matching\n• Predictable and transparent\n• Limited to programmed rules\n\n**AI-based chatbots**:\n• Use ML/NLP models\n• Can handle open-ended conversations\n• Learn and improve over time",
    ],
  },
];

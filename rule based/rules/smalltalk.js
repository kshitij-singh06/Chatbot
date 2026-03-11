/**
 * Small Talk Rules
 */
module.exports = [
  {
    patterns: [/tell me a joke/, /joke/, /make me laugh/, /something funny/],
    responses: [
      "Why do programmers prefer dark mode? Because light attracts bugs! 🐛😄",
      "Why was the JavaScript developer sad? Because he didn't Node how to Express himself! 😂",
      "There are only 10 types of people in the world: those who understand binary and those who don't! 😆",
      "A SQL query walks into a bar, sees two tables, and asks: 'Can I JOIN you?' 🍺",
    ],
  },
  {
    patterns: [/fun fact/, /tell me (a |some)?fact/, /did you know/],
    responses: [
      "Fun fact: The first computer bug was an actual bug! In 1947, a moth was found stuck in a Harvard computer. 🦋",
      "Did you know? The first programmer in history was Ada Lovelace, who wrote algorithms for Charles Babbage's Analytical Engine in the 1840s! 👩‍💻",
      "Fun fact: There are approximately 700 different programming languages in existence! 🌐",
      "Did you know? The word 'robot' comes from the Czech word 'robota', meaning forced labor. 🤖",
    ],
  },
  {
    patterns: [/thank/, /thanks/, /thx/, /thank you/],
    responses: [
      "You're welcome! 😊 Glad I could help!",
      "Happy to help! Let me know if you have more questions.",
      "No problem at all! That's what I'm here for! 🌟",
      "Anytime! Feel free to ask anything else.",
    ],
  },
  {
    patterns: [/weather/, /temperature/, /forecast/],
    responses: [
      "I'm not able to check live weather 🌤️, but I'd suggest using a weather app or website like weather.com for accurate forecasts!",
    ],
  },
  {
    patterns: [/time/, /what time/, /current time/],
    responses: [
      "I don't have access to a real-time clock ⏰, but you can check the time on your device!",
    ],
  },
  {
    patterns: [/bored/, /i('m|\s+am) bored/, /nothing to do/],
    responses: [
      "How about learning something new? Ask me about AI, Machine Learning, or programming! 📚",
      "You could try solving a coding challenge on LeetCode or HackerRank! 💻",
      "Want to hear a joke or a fun fact? Just ask! 😄",
    ],
  },
];

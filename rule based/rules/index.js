const greetings = require("./greetings");
const farewell = require("./farewell");
const help = require("./help");
const smalltalk = require("./smalltalk");
const academic = require("./academic");
const fallback = require("./fallback");

const allRules = [
  ...greetings,
  ...farewell,
  ...help,
  ...academic,
  ...smalltalk,
  ...fallback, 
];

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function matchRule(input) {
  const normalized = input.toLowerCase().trim();

  for (const rule of allRules) {
    for (const pattern of rule.patterns) {
      // Support both RegExp and plain-string keywords
      const isMatch =
        pattern instanceof RegExp
          ? pattern.test(normalized)
          : normalized.includes(pattern.toLowerCase());

      if (isMatch) {
        return randomChoice(rule.responses);
      }
    }
  }

  return "I'm not sure I understand. Could you rephrase that?";
}

module.exports = { matchRule };

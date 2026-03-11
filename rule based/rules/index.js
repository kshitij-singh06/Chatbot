/**
 * Rule Engine
 * -----------
 * Loads every rule-set module and exposes a single `matchRule(input)` function.
 *
 * Each rule-set module exports an array of rule objects:
 *   { patterns: [RegExp | string], responses: [string] }
 *
 * - `patterns`  → regex or plain keywords to match against user input
 * - `responses` → possible replies (one is picked at random for variety)
 */

const greetings = require("./greetings");
const farewell = require("./farewell");
const help = require("./help");
const smalltalk = require("./smalltalk");
const academic = require("./academic");
const fallback = require("./fallback");

// Order matters — first match wins
const allRules = [
  ...greetings,
  ...farewell,
  ...help,
  ...academic,
  ...smalltalk,
  ...fallback, // always keep fallback last
];

/**
 * Pick a random element from an array.
 */
function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Try to match the user's message against every rule.
 * Returns the first matching response.
 */
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

  // Should never reach here because fallback catches everything,
  // but just in case:
  return "I'm not sure I understand. Could you rephrase that?";
}

module.exports = { matchRule };

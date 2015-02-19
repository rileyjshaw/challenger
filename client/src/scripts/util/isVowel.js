// a, e, i, o, u...
// and NEVER y.
//
module.exports = function isVowel (c) {
  c = c.toUpperCase();
  return c === 'A' || c === 'E' || c === 'I' || c === 'O' || c === 'U';
}

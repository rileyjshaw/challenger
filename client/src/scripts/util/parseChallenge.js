// Accepts a challenge object, containing:
//  - whitelist and blacklist arrays
//  - a nestedRules object for nested rules
//  - a customRules array,
// Returns an object formatted for the UI state:
// {rules[], required[], present[]}.
//
var flatmap = require('flatmap');
var fillArray = require('./fillArray');

// Recursively walks the nested object to form rule chains.
// rule chains move from most to least nested & start with a bool.
// bool === if chain is required or prohibited in the challenge.
function chainTransform (obj, path = []) {
  return flatmap(Object.keys(obj), function (key) {
    if (key === 'required') {
      // starts array with `true` or `false` and makes the
      // deepest-nested expression first in the array
      return [path.concat(obj[key]).reverse()];
    } else {
      return chainTransform(obj[key], path.concat(key));
    }
  });
}

function parseChallenge (args) {
  var {
    whitelist = [],
    blacklist = [],
    nestedRules = {},
    customRules = [],
    output,
    initialText = ''
  } = args;

  var nestedChains = chainTransform(nestedRules);

  var numRules = whitelist.length + blacklist.length +
                 nestedChains.length + customRules.length;

  var rules = whitelist.map(exp => ({type: 'expressionChain', chain: [exp]}))
    // white/blacklist have their expression strings wrapped in [] to match nestedChains
    .concat(blacklist.map(exp => ({type: 'expressionChain', chain: [exp]})))
    // nested expression chains have arrays of expression strings as values
    .concat(nestedChains.map(chain => ({type: 'expressionChain', chain: chain.slice(1)})))
    // custom rules have evaluation functions as values
    .concat(customRules.map(({description, fn}) => ({type: 'custom', description, fn})));

  var required = whitelist.map(() => true)
    .concat(blacklist.map(() => false))
    .concat(nestedChains.map(chain => chain[0]))
    .concat(customRules.map(() => true));

  if (output) {
    output.type = 'output';
    rules.push(output);
    required.push(true);
    ++numRules;
  }

  var present = fillArray(numRules, false);

  var title = args.title || (numRules ? 'JavaScript Challenge' : 'Sandbox');
  var description = args.description || (numRules ? 'Meet all of the following requirements, then hit Submit to continue.' : 'There aren\'t any requirements in this level; just play around, and hit Submit when you\'re ready to continue.');

  return {
    title,
    description,
    initialText,
    numRules,
    rules,
    required,
    present
  };
}

module.exports = parseChallenge;

// Accepts a challenge object, containing whitelist and
// blacklist arrays and a structure object for nested rules.
// Returns an object formatted for the UI state:
// {expressionChains[], required[], present[]}.
//
var flatmap = require('flatmap');

// Recursively walks the structure object to form "Rule Arrays".
// Rule Arrays move from most to least nested & start with a bool.
// bool === if chain is required or prohibited in the challenge.
function walk (obj, path = []) {
  return flatmap(Object.keys(obj), function (key) {
    if (key === 'required') {
      // starts array with `true` or `false` and makes the
      // deepest-nested expression first in the array
      return [path.concat(obj[key]).reverse()];
    } else {
      return walk(obj[key], path.concat(key));
    }
  });
}

function parseChallenge (challenge) {
  var whitelist = challenge.whitelist || [];
  var blacklist = challenge.blacklist || [];
  var structure = challenge.structure || {};

  var walkedStructure = walk(structure);

  var expressionChains = whitelist.map(exp => [exp])
    .concat(blacklist.map(exp => [exp]))
    .concat(walkedStructure.map(arr => arr.slice(1)));

  var required = whitelist.map(exp => true)
    .concat(blacklist.map(exp => false))
    .concat(walkedStructure.map(arr => arr[0]));

  var present = whitelist.map(exp => false)
    .concat(blacklist.map(exp => false))
    .concat(walkedStructure.map(arr => false));

  var numRules = present.length;

  var title = challenge.title || (numRules ? 'JavaScript Challenge' : 'Sandbox');
  var description = challenge.description || (numRules ? 'Meet all of the following requirements, then hit Submit to continue.' : 'There aren\'t any requirements in this level; just play around, and hit Submit when you\'re ready to continue.');
  var initialText = challenge.initialText || '';

  var newRules = {
    title,
    description,
    initialText,
    expressionChains,
    required,
    present
  };

  // add the expressions from structure as rule Arrays and return
  return newRules;
}

module.exports = parseChallenge;

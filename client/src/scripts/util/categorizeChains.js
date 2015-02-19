// accepts an array of `expressionChains` and organizes them
// in an object according to their deepest-nested expression.
//
module.exports = function categorizeChains (expressionChains) {
  var categorized = {};

  expressionChains.forEach(function (chain, i) {
    // the deepest-nested expression, i.e. the one we'll
    // be looking for
    var exp = chain[0];

    if (!categorized[exp]) {
      categorized[exp] = [];
    }

    categorized[exp].push({
      chain: chain.slice(1),
      index: i
    });
  });

  return categorized;
};

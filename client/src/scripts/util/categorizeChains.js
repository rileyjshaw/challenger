// accepts an array of rules and organizes the expression chains
// in an object according to their deepest-nested expression.
//
module.exports = function categorizeChains (rules) {
  return rules.reduce((categorized, {value, index}) => {
    // if an expression comes from the whitelist or blacklist
    // it'll be a simple string
    var chain = typeof value === 'string' ? [value] : value;

    // the deepest-nested expression, i.e. the one we're
    // looking for
    var exp = chain[0];

    if (!categorized[exp]) {
      categorized[exp] = [];
    }

    categorized[exp].push({
      chain: chain.slice(1),
      index
    });

    return categorized;
  }, {});
};

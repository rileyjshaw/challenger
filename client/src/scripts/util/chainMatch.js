// checks if a chain matches the current AST node
//
module.exports = function chainMatch (chain, state) {
    // fast exit if there's no tree to resolve
    if (chain.length === 0) return true;

    state = state
      // `state` still contains the matched expression and
      // the top-level program node
      .slice(1, -1)
      // the `type` string is all we care about
      .map(node => node.type)
      // `state` moves from least -> most nested, which is
      // opposite to the direction of `chain`
      .reverse();

    var chainLength = chain.length;
    var chainIdx = 0;

    for (var i = 0, _len = state.length; i < _len; i++) {
      if (chain[chainIdx] === state[i])
        if (++chainIdx === chainLength) return true;
    }

    return false;
};

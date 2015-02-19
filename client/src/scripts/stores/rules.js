// holds current challenge data
//
var Reflux = require('reflux');
var actions = require('../actions');

var parseChallenge = require('../util/parseChallenge');

var ruleStore = Reflux.createStore({
  listenables: actions,
  init() { this.rules = {}; },

  onChallengeUpdate(newChallenge) {
    this.rules = parseChallenge(newChallenge);

    // pass on to listeners
    this.trigger(this.rules);
  }
});

module.exports = ruleStore;

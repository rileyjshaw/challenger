// holds current challenge data
//
var Reflux = require('reflux');
var actions = require('../actions');

var parseChallenge = require('../util/parseChallenge');

var ruleStore = Reflux.createStore({
  listenables: actions,
  init() { this.rules = {}; },

  onChallengeUpdate(newChallenge) {
    this.challenge = parseChallenge(newChallenge);

    // pass on to listeners
    this.trigger(this.challenge);
  }
});

module.exports = ruleStore;

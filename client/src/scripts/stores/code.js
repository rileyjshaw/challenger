// holds current user input and compares it with
// a ruleset from ruleStore.
//
// reflux
var Reflux = require('reflux');
var actions = require('../actions');
var ruleStore = require('./rules');

// acorn
var acorn = require('acorn');
var walk = require('acorn/util/walk').ancestor;

// utils
var categorizeChains = require('../util/categorizeChains');
var chainMatch = require('../util/chainMatch');
var fillArray = require('../util/fillArray');

// internal, returns an obj that can be used by acorn's ancestor walk

var codeStore = Reflux.createStore({
  listenables: actions,
  init() {
    // stored values
    this.code = '';
    this.present = [];
    this.expRules = {};

    // register ruleStore's changes
    this.listenTo(ruleStore, this.updateRuleset);
  },

  updateRuleset(rules) {
    var expressionChains = rules.expressionChains;
    this.numRules = expressionChains.length;
    this.expRules = this.createWalkableRuleset(expressionChains);
  },

  // handle codeEditUser action, called from Editor
  onCodeEditUser(input) {
    this.code = input;

    if (this.verifyInput(input)) {
      this.trigger({
        present: this.present,
        valid: true
      });
    } else {
      this.trigger({ valid: false });
    }
  },

  onChallengeUpdate(newChallenge) {
    this.onCodeEditOverride(newChallenge.initialText || '');
  },

  onCodeEditOverride(input) {
    // this.text will be set on the resultant onCodeEditUser action
    this.trigger(input);
  },

  verifyInput(input) {
    // reset this.present; `walk` flips matches to true
    this.present = fillArray(this.numRules, false);

    try {
      let ast = acorn.parse(input);
      walk(ast, this.expRules);
      return true;
    } catch (err) {
      return false;
    }
  },

  createWalkableRuleset(expressionChains) {
    var newExpRules = {};
    var categorized = categorizeChains(expressionChains);

    Object.keys(categorized).forEach((exp) => {
      // an array of {index, chain, required} objects
      var rules = categorized[exp];

      newExpRules[exp] = (node, state) => {
        // cycle through each rule chain when a node
        // of a given type is reached
        rules.forEach((rule) => {
          if (chainMatch(rule.chain, state)) {
            this.present[rule.index] = true;
          }
        });

      };
    });

    return newExpRules;
  }

});

module.exports = codeStore;

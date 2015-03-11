// holds current user input and compares it with
// a ruleset from ruleStore.
//
// reflux
var Reflux = require('reflux');
var actions = require('../actions');
var ruleStore = require('./rules');

// acorn
var acorn = require('acorn');
var walkAST = require('acorn/util/walk').ancestor;

// utils
var categorizeChains = require('../util/categorizeChains');
var chainMatch = require('../util/chainMatch');
var fillArray = require('../util/fillArray');

var codeStore = Reflux.createStore({
  listenables: actions,
  init() {
    // stored values
    this.code = '';
    this.present = [];
    this.customRules = [];
    this.nestedRules = [];
    this.walkableNestedRules = {};

    // register ruleStore's changes
    this.listenTo(ruleStore, this.updateRuleset);
  },

  updateRuleset({rules, numRules, initialText}) {
    // add `index` key to rule array to keep position reference
    // in filtered lists
    rules = rules.map((rule, i) => {
      rule.index = i;
      return rule;
    });

    this.numRules = numRules;
    this.customRules = rules.filter(rule => rule.type === 'custom');
    this.nestedRules = rules.filter(rule => rule.type === 'expressionChain');
    this.walkableNestedRules = this.createWalkableRuleset(this.nestedRules);
    // TODO: this.expectedOutput = ...

    this.onCodeEditOverride(initialText);
  },

  // handle codeEditUser action, called from Editor.
  // verifyStructure, verifyCustomRules, and verifyOutput
  // all have side effects on the this.present array,
  // updating it for the current input.
  onCodeEditUser(input) {
    // the following three methods have side effects on `this.present`
    var codeIsValid = this.verifyNestedRules(input);
    // TODO if (codeIsValid) this.validateOutput();
    this.verifyCustomRules(input);

    this.code = input;
    this.trigger({
      // send a new object, since pureRenderMixin compares pointers
      present: this.present.slice(),
      valid: codeIsValid
    });
  },

  // edits code and overwrites it in CodeMirror
  onCodeEditOverride(input) {
    // this.code will be set on the resultant onCodeEditUser action
    this.trigger(input);
  },

  verifyNestedRules(input) {
    // reset each nestedRule index in this.present to false
    this.nestedRules.forEach(({index}) => this.present[index] = false);

    // `walkAST` sets this.present to true for matching rules
    try {
      let ast = acorn.parse(input);
      walkAST(ast, this.walkableNestedRules);
      return true;
    } catch (err) {
      return false;
    }
  },

  verifyCustomRules(input) {
    this.customRules.forEach(({fn, index}) => {
      this.present[index] = !!fn(input);
    });
  },

  // returns an obj that can be used by acorn's ancestor walk
  createWalkableRuleset(rules) {
    var categorized = categorizeChains(rules);

    return Object.keys(categorized).reduce((walkableRuleset, exp) => {
      // an array of {index, chain} objects
      var rules = categorized[exp];

      walkableRuleset[exp] = (node, state) => {
        // cycle through each rule chain when a node
        // of a given type is reached
        rules.forEach(({index, chain}) => {
          if (chainMatch(chain, state)) {
            this.present[index] = true;
          }
        });
      };

      return walkableRuleset;
    }, {});
  }
});

module.exports = codeStore;

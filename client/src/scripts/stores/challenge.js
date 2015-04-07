// holds current user input and compares it with
// a ruleset from courseStore.
//
// reflux
var Reflux = require('reflux');
var actions = require('../actions');
var courseStore = require('./course');

// acorn
var acorn = require('acorn');
// TODO update to 'acorn/dist/walk' for acorn v1.x.x
var walkAST = require('acorn/util/walk').ancestor;

// utils
var categorizeChains = require('../util/categorizeChains');
var chainMatch = require('../util/chainMatch');
var fillArray = require('../util/fillArray');
var runCode = require('../util/runCode.js');

var challengeStore = Reflux.createStore({
  listenables: actions,
  init() {
    // stored values
    this.numRules = 0;
    this.initialText = '';
    this.present = [];
    this.customRules = [];
    this.nestedRules = [];
    this.walkableNestedRules = {};
    this.output = undefined;

    // register courseStore's changes
    this.listenTo(courseStore, this.updateRuleset);
  },

  updateRuleset({rules, numRules, initialText}) {
    // add `index` key to rule array to keep position reference
    // in filtered lists
    rules = rules.map((rule, i) => {
      rule.index = i;
      return rule;
    });

    this.numRules = numRules;
    this.initialText = initialText;
    this.present = fillArray(numRules, false);
    this.customRules = rules.filter(rule => rule.type === 'custom');
    this.nestedRules = rules.filter(rule => rule.type === 'expressionChain');
    this.walkableNestedRules = this.createWalkableRuleset(this.nestedRules);
    this.output = rules.filter(rule => rule.type === 'output')[0];
  },

  // handle codeEditUser action, called from Editor.
  // verifyStructure, verifyCustomRules, and verifyOutput
  // all have side effects on the this.present array,
  // updating it for the current input.
  onCodeEditUser(input) {
    // the following three methods have side effects on `this.present`
    var valid = this.verifyNestedRules(input);
    var checkingOutput = valid && this.output;
    this.verifyCustomRules(input);

    if (checkingOutput) {
      this.verifyOutput(input); // async, updates output rule
    }

    this.triggerPresent(valid, checkingOutput); // sync, updates structure & custom rules
  },

  // edits code and overwrites it in CodeMirror
  onCodeEditOverride(input) {
    // state will be set on the resultant onCodeEditUser action
    this.trigger(input || this.initialText);
  },

  verifyNestedRules(input) {
    // reset each nestedRule index in this.present to false
    this.nestedRules.forEach(({index}) => this.present[index] = false);

    // `walkAST` sets this.present to true for matching rules
    try {
      let ast = acorn.parse(input, { ecmaVersion: 6 });
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

  verifyOutput(input) {
    var {fn, index} = this.output;

    this.present[index] = false;
    runCode(input, fn, function trigger (present) {
      this.present[index] = present;
      this.triggerPresent(true, false);
    }.bind(this));
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
  },

  triggerPresent(valid, checkingOutput) {
    this.trigger({
      // send a new object, since pureRenderMixin compares pointers
      present: this.present.slice(),
      valid: !!valid,
      checkingOutput: !!checkingOutput
    });
  }
});

module.exports = challengeStore;

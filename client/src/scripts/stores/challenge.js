// holds current user input and compares it with
// a ruleset from courseStore.
//
// reflux
var Reflux = require('reflux');
var actions = require('../actions');
var courseStore = require('./course');

// acorn
var acorn = require('acorn');
var walkAST = require('acorn/dist/walk').ancestor;

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
    this.initialCode = '';
    this.present = [];
    this.customRules = [];
    this.nestedRules = [];
    this.walkableNestedRules = {};
    this.debounceTimeout = null;
    this.clearLastExecution = () => null;
    this.output = undefined;

    // register courseStore's changes
    this.listenTo(courseStore, this.updateRuleset);
  },

  updateRuleset({rules, numRules, initialCode}) {
    // course store also sends out a maxIndex trigger; only run on ruleset triggers
    if (numRules) {
      // add `index` key to rule array to keep position reference
      // in filtered lists
      rules = rules.map((rule, i) => {
        rule.index = i;
        return rule;
      });

      this.numRules = numRules;
      this.initialCode = initialCode;
      this.present = fillArray(numRules, false);
      this.customRules = rules.filter(rule => rule.type === 'custom');
      this.nestedRules = rules.filter(rule => rule.type === 'expressionChain');
      this.walkableNestedRules = this.createWalkableRuleset(this.nestedRules);
      this.debounceTimeout = null;
      this.clearLastExecution = () => null;
      this.output = rules.filter(rule => rule.type === 'output')[0];
    }
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

    // debounce runCode function so that it's only run after
    // typing has paused for 450ms
    clearTimeout(this.debounceTimeout);

    // stop the last worker from running
    this.clearLastExecution();

    if (checkingOutput) {
      // async, updates output rule
      this.debounceTimeout = setTimeout(() => {
        this.clearLastExecution = this.verifyOutput(input);
      }, 450);
    }

    this.triggerPresent(valid, checkingOutput); // sync, updates structure & custom rules
  },

  // edits code and overwrites it in CodeMirror
  onCodeEditOverride(input) {
    // state will be set on the resultant onCodeEditUser action
    this.trigger(input || this.initialCode);
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
    this.customRules.forEach(({verify, index}) => {
      this.present[index] = !!verify(input);
    });
  },

  verifyOutput(input) {
    var {index, setup, teardown, verify} = this.output;

    var fullCode = `${setup};${input};${teardown}`;
    var trigger = (present) => {
      this.present[index] = present;
      this.triggerPresent(true, false);
    };

    this.present[index] = false;
    return runCode(fullCode, verify, trigger);
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

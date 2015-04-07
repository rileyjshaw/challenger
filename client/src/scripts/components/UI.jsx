var {React, createPureClass} = require('../util/createPureClass.js');

// reflux
var Reflux = require('reflux');
var ruleStore = require('../stores/rules');
var codeStore = require('../stores/code');

// components
var Challenge = require('./Challenge.jsx');

var UI = createPureClass({
  mixins: [
    Reflux.connect(ruleStore),
    Reflux.listenTo(codeStore, 'onCodeStoreChange')
  ],

  getInitialState() {
    return {
      title: '',
      description: '',
      valid: true,
      checkingOutput: false,
      rules: [],
      required: [],
      present: []
    };
  },

  // codeStore can also emit an editorText string after a
  // codeEditOverride, so we typecheck before setting state
  onCodeStoreChange(newState) {
    if (typeof newState === 'object') {
      this.setState(newState);
    }
  },

  render() {
    return (
      <Challenge
        title={this.state.title}
        description={this.state.description}
        valid={this.state.valid}
        checkingOutput={this.state.checkingOutput}
        rules={this.state.rules}
        required={this.state.required}
        present={this.state.present}
      />
    );
  },
});

module.exports = UI;

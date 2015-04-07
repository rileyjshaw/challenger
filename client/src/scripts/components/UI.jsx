var {React, createPureClass} = require('../util/createPureClass.js');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

// reflux
var Reflux = require('reflux');
var courseStore = require('../stores/course');
var challengeStore = require('../stores/challenge');

// components
var Challenge = require('./Challenge.jsx');

var UI = createPureClass({
  mixins: [
    Reflux.connect(courseStore),
    Reflux.listenTo(challengeStore, 'onChallengeStoreChange')
  ],

  getInitialState() {
    return {
      index: -1,
      title: '',
      description: '',
      valid: true,
      checkingOutput: false,
      rules: [],
      required: [],
      present: []
    };
  },

  // challengeStore can also emit an editorText string after a
  // codeEditOverride, so we typecheck before setting state
  onChallengeStoreChange(newState) {
    if (typeof newState === 'object') {
      this.setState(newState);
    }
  },

  render() {
    var index = this.state.index;

    return (
      <ReactCSSTransitionGroup
        transitionName='challenge'
        component='div'
        // TODO
        transitionAppear={false}
        transitionEnter={false}
        transitionLeave={false} >
        {index === -1 ? '' :
          <Challenge
            key={index}
            index={index}
            title={this.state.title}
            description={this.state.description}
            valid={this.state.valid}
            checkingOutput={this.state.checkingOutput}
            rules={this.state.rules}
            required={this.state.required}
            present={this.state.present}
          />
        }
      </ReactCSSTransitionGroup>
    );
  },
});

module.exports = UI;

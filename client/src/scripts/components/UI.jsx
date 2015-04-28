var {React, createPureClass} = require('../util/createPureClass.js');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

// reflux
var Reflux = require('reflux');
var courseStore = require('../stores/course');
var challengeStore = require('../stores/challenge');

// components
var Challenge = require('./Challenge.jsx');

var UI = createPureClass({
  propTypes: {
    unmount: React.PropTypes.func.isRequired,
    successText: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.object,
    ]),
  },

  mixins: [
    Reflux.connect(courseStore),
    Reflux.listenTo(challengeStore, 'onChallengeStoreChange')
  ],

  getInitialState() {
    return {
      courseCompleted: false,
      index: -1,
      maxIndex: -1,
      title: '',
      description: '',
      valid: true,
      checkingOutput: false,
      rules: [],
      required: [],
      present: [],
    };
  },

  // challengeStore can also emit an editorText string after a
  // codeEditOverride, so we typecheck before setting state
  onChallengeStoreChange(newState) {
    if (typeof newState === 'object') {
      this.setState(newState);
    }
  },

  handleKeyDown(e){
    // if (e.which === 27) this.unmount();
  },

  unmount() { this.props.unmount(this.state.completed) },

  render() {
    var {
      courseCompleted,
      index,
      maxIndex,
      title,
      description,
      valid,
      checkingOutput,
      rules,
      required,
      present,
    } = this.state;

    return (
      <ReactCSSTransitionGroup
        onKeyDown={this.handleKeyDown}
        transitionName='challenge'
        component='div'
        className='challenge-outer' >
        {index === -1 ? '' :
          <Challenge
            courseCompleted={courseCompleted}
            key={courseCompleted ? -2 : index}
            index={index}
            maxIndex={maxIndex}
            title={title}
            description={description}
            valid={valid}
            checkingOutput={checkingOutput}
            rules={rules}
            required={required}
            present={present}
            unmount={this.unmount}
            successText={this.props.successText}

            />
        }
      </ReactCSSTransitionGroup>
    );
  },
});

module.exports = UI;

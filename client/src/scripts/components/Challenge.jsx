var {React, createPureClass} = require('../util/createPureClass.js');

var RuleList = require('./RuleList.jsx');
var SuccessScreen = require('./SuccessScreen.jsx');
var Editor = require('./Editor.jsx');
var X = require('./icons/X.jsx');

var challengeCompleted = require('../actions').challengeCompleted;

var Challenge = createPureClass({
  propTypes: {
    courseCompleted: React.PropTypes.bool.isRequired,
    key: React.PropTypes.number.isRequired,
    index: React.PropTypes.number.isRequired,
    maxIndex: React.PropTypes.number.isRequired,
    title: React.PropTypes.string.isRequired,
    description: React.PropTypes.string.isRequired,
    valid: React.PropTypes.bool.isRequired,
    checkingOutput: React.PropTypes.bool.isRequired,
    rules: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    required: React.PropTypes.arrayOf(React.PropTypes.bool).isRequired,
    present: React.PropTypes.arrayOf(React.PropTypes.bool).isRequired,
    unmount: React.PropTypes.func.isRequired,
    successText: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.object,
    ]),
  },

  challengeSuccess() {
    var code = this.refs.editor.getText();
    challengeCompleted(code);
  },

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
      unmount,
      successText,
    } = this.props;

    // true if the `required` and `present` arrays match perfectly
    var isCorrect = required.every((x, i) => x === present[i]);

    return (
      <div className='challenge'>
        <h1
          // !!!
          dangerouslySetInnerHTML={{
            __html: courseCompleted ?
              'Congratulations' :
              (maxIndex ? `<small>${index + 1} of ${maxIndex + 1}</small>` : '') + title
          }}
        />
        <button className='unmount' onClick={this.props.unmount}>
          <X size={48} />
        </button>
        <div className='challenge-frame'>
          {courseCompleted ? <SuccessScreen text={successText} /> :
            <div className='challenge-content'>
              <p
                className='description'
                // !!!
                dangerouslySetInnerHTML={{ __html: description }}
              />
              <RuleList
                valid={valid}
                checkingOutput={checkingOutput}
                rules={rules}
                required={required}
                present={present}
              />
              <Editor ref='editor' />
            </div>
          }
          <button
            className='submit'
            disabled={!(valid && isCorrect || courseCompleted)}
            onClick={courseCompleted ? unmount : this.challengeSuccess}>
              {courseCompleted ? 'Go Back' : 'Submit'}
          </button>
        </div>
      </div>
    );
  },
});

module.exports = Challenge;

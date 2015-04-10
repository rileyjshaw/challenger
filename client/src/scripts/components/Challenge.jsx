var {React, createPureClass} = require('../util/createPureClass.js');

var RuleList = require('./RuleList.jsx');
var Editor = require('./Editor.jsx');
var X = require('./icons/X.jsx');

var challengeCompleted = require('../actions').challengeCompleted;

var Challenge = createPureClass({
  propTypes: {
    index: React.PropTypes.number.isRequired,
    maxIndex: React.PropTypes.number.isRequired,
    title: React.PropTypes.string.isRequired,
    description: React.PropTypes.string.isRequired,
    valid: React.PropTypes.bool.isRequired,
    checkingOutput: React.PropTypes.bool.isRequired,
    rules: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    required: React.PropTypes.arrayOf(React.PropTypes.bool).isRequired,
    present: React.PropTypes.arrayOf(React.PropTypes.bool).isRequired,
  },

  success: (code) => challengeCompleted(code), // TODO: need to pass code string to this function

  render() {
    var {
      index,
      maxIndex,
      title,
      description,
      valid,
      checkingOutput,
      rules,
      required,
      present,
    } = this.props;

    // true if the `required` and `present` arrays match perfectly
    var isCorrect = required.every((x, i) => x === present[i]);

    return (
      <div className='challenge'>
        <h1
          // !!!
          dangerouslySetInnerHTML={{
            __html: `<small>${index + 1} of ${maxIndex + 1}</small>${title}`
          }}
        />
        <button className='unmount' onClick={this.props.unmount}>
          <X size={48} />
        </button>
        <div className='challenge-frame'>
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
            <Editor />
          </div>
          <button
            className='submit'
            disabled={!(valid && isCorrect)}
            onClick={this.success}>
              Submit
          </button>
        </div>
      </div>
    );
  },
});

module.exports = Challenge;

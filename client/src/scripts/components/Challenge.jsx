var {React, createPureClass} = require('../util/createPureClass.js');

var RuleList = require('./RuleList.jsx');
var Editor = require('./Editor.jsx');

var Challenge = createPureClass({
  propTypes: {
    title: React.PropTypes.string.isRequired,
    description: React.PropTypes.string.isRequired,
    valid: React.PropTypes.bool.isRequired,
    expressionChains: React.PropTypes.arrayOf(React.PropTypes.array).isRequired,
    required: React.PropTypes.arrayOf(React.PropTypes.bool).isRequired,
    present: React.PropTypes.arrayOf(React.PropTypes.bool).isRequired
  },

  success: () => alert('You did it!'),

  render() {
    // true if the `required` and `present` arrays match perfectly
    var isCorrect = this.props.required.every((x, i) => x === this.props.present[i]);

    return (
      <div>
        <h1
          // !!!
          dangerouslySetInnerHTML={{ __html: this.props.title }}
        />
        <p
          className='description'
          // !!!
          dangerouslySetInnerHTML={{ __html: this.props.description }}
        />
        <RuleList
          valid={this.props.valid}
          expressionChains={this.props.expressionChains}
          required={this.props.required}
          present={this.props.present}
        />
        <Editor />
        <button disabled={!isCorrect} onClick={this.success}>Submit</button>
      </div>
    );
  },
});

module.exports = Challenge;

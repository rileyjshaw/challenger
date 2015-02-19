var React = require('react');

var RuleList = require('./RuleList.jsx');
var Editor = require('./Editor.jsx');

var Challenge = React.createClass({
  success: () => alert('You did it!'),

  render() {
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
        <button disabled={!this.props.correct} onClick={this.success}>Submit</button>
      </div>
    );
  },
});

module.exports = Challenge;

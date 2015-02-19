var React = require('react');
var Rule = require('./Rule.jsx');

var RuleList = React.createClass({

  render() {
    // destructure this.props
    var {
      expressionChains: expressionChains,
      required: required,
      present: present
    } = this.props;

    var rules = expressionChains.map(function (chain, i) {
      return (
        <Rule
          key={i + 1}
          expressionChain={chain}
          required={required[i]}
          present={present[i]}
        />
      );
    });

    rules.unshift(
      <Rule
        key={0}
        required={true}
        description='be valid JavaScript'
        present={this.props.valid}
      />
    );

    return (
      <ul className='rules'>
        { rules }
      </ul>
    );
  },
});

module.exports = RuleList;

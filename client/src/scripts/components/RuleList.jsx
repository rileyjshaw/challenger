var {React, createPureClass} = require('../util/createPureClass.js');
var Rule = require('./Rule.jsx');

var makeChainReadable = require('../util/makeChainReadable');

var RuleList = createPureClass({
  propTypes: {
    valid: React.PropTypes.bool.isRequired,
    rules: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    required: React.PropTypes.arrayOf(React.PropTypes.bool).isRequired,
    present: React.PropTypes.arrayOf(React.PropTypes.bool).isRequired
  },

  render() {
    var {rules, required, present, valid} = this.props;

    rules = rules.map(function ({type, chain, description}, i) {
      var isChain = type === 'expressionChain';

      return (
        <Rule
          key={i + 1}
          description={isChain ? makeChainReadable(chain) : description}
          required={required[i]}
          present={present[i]}
          blocked={isChain && !valid}
        />
      );
    });

    rules.unshift(
      <Rule
        key={0}
        required={true}
        description='Program must be valid JavaScript'
        present={valid}
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

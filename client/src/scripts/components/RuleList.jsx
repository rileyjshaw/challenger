var {React, createPureClass} = require('../util/createPureClass.js');
var Rule = require('./Rule.jsx');

var makeChainReadable = require('../util/makeChainReadable');

var RuleList = createPureClass({
  propTypes: {
    valid: React.PropTypes.bool.isRequired,
    checkingOutput: React.PropTypes.bool.isRequired,
    rules: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    required: React.PropTypes.arrayOf(React.PropTypes.bool).isRequired,
    present: React.PropTypes.arrayOf(React.PropTypes.bool).isRequired
  },

  render() {
    var {rules, required, present, valid, checkingOutput} = this.props;

    rules = rules.map(function ({type, chain, description}, i) {
      var isChain = type === 'expressionChain';
      var isOutput = type === 'output';

      return (
        <Rule
          key={i + 1}
          description={isChain ? makeChainReadable(chain, required[i]) : description}
          required={required[i]}
          present={present[i] && (isOutput ? valid : true)}
          blocked={(isChain && !valid) || (isOutput && checkingOutput)}
          spins={isOutput}
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

var {React, createPureClass} = require('../util/createPureClass.js');
var Rule = require('./Rule.jsx');

var makeReadable = require('../util/makeReadable');

var RuleList = createPureClass({
  propTypes: {
    valid: React.PropTypes.bool.isRequired,
    expressionChains: React.PropTypes.arrayOf(React.PropTypes.array).isRequired,
    required: React.PropTypes.arrayOf(React.PropTypes.bool).isRequired,
    present: React.PropTypes.arrayOf(React.PropTypes.bool).isRequired
  },

  render() {
    var {expressionChains, required, present} = this.props;

    var rules = expressionChains.map(function (chain, i) {
      return (
        <Rule
          key={i + 1}
          description={makeReadable(chain)}
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

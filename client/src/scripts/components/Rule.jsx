var React = require('react');
var isVowel = require('../util/isVowel');

var Rule = React.createClass({
  render() {
    // destructure this.props
    var {
      expressionChain: expressionChain,
      required: required,
      present: present
    } = this.props;

    var description =
      // either the passed description, or,
      this.props.description ||
      // the expression chain translated to plain English
      expressionChain.map(function (exp, i) {
        // add spaces to the expression name and lowercase it
        var readableExp = exp.replace(/(.)([A-Z])/g, '$1 $2').toLowerCase();

        return (
          <span key={i}>
            {/* add `contain` for the first expression and `within` subsequently */}
            {i ? ' within ' : 'contain '}
            {/* prepend with 'a' or 'an', depending on the first character */}
            {isVowel(exp[0]) ? 'an ' : 'a '}
            <strong>
              {readableExp}
            </strong>
          </span>
        );
      });

    var instructions = `Program must ${required ? '' : 'not '}`;

    return (
      <li className={present === required ? 'complete' : 'incomplete'}>
        <p>{instructions}{description}.</p>
      </li>
    );
  },
});

module.exports = Rule;

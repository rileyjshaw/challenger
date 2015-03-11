var React = require('react');
var isVowel = require('./isVowel');

// translates an expression chain to plain English
//
module.exports = function (expressionChain, required) {
  return [`Program must ${required ? '' : 'not '}`].concat(
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
    })
  );
};

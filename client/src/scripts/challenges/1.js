var initialText = `var array = ['Donde', 'Esta', 'La', 'Biblioteca'];

var i = 0;
while (i < array.length) {
  if (i % 2 === 0) {
    console.log(array[i]);
  }

  i++;
}
`;

module.exports = {
  title: 'for( ) the love of loops.',
  description: 'Now that we\'ve covered the <code>while</code> loop, it\'s time to take a look at its twin sister: the <code>for</code> loop. Iterate through the array using a <code>for</code> loop, and log the content for all <em>even</em> indices.',
  initialText: initialText,
  whitelist: ['ForStatement'],
  blacklist: ['WhileStatement'],
  nestedRules: {
    ForStatement: {
      IfStatement: {
        required: true
      }
    }
  },
  customRules: [
    {
      description: 'Must have the word \'poo\' in it.',
      fn: function (code) { return code.indexOf('foobar') > -1;}
    }
  ]
};

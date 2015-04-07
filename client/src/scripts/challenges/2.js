var initialText = `[0,1,2,3,4,5].map(verify);
n => this;
`;

module.exports = {
  title: 'Arrow functions.',
  description: 'Arrow functions let you define functions with a shorter syntax than standard <code>function</code> expressions. They also lexically bind the <code>this</code> value, so you don\'t need to <code>.bind(this)</code> as frequently!',
  initialText: initialText,
  whitelist: ['ArrowFunctionExpression'],
  blacklist: ['FunctionExpression'],
  nestedRules: {
    ArrowFunctionExpression: {
      ThisExpression: {
        required: true
      }
    }
  },
  customRules: [{
    description: 'Program must be under 40 characters',
    fn: (str) => str.length < 40
  }],
  output: {
    description: 'Program must call the verify function on the numbers 0 through 5, in order',
    fn: (function () {
      var nums = [0, 1, 2, 3, 4, 5];

      return function (i) {
        if (i === nums[0]) nums.shift();
        return nums.length === 0;
      }
    })()
  }
};

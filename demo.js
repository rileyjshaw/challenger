(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var course = [require("./challenges/1"), require("./challenges/2")];
challenger(course);

},{"./challenges/1":2,"./challenges/2":3}],2:[function(require,module,exports){
"use strict";

var initialText = "var array = ['Donde', 'Esta', 'La', 'Biblioteca'];\n\nvar i = 0;\nwhile (i < array.length) {\n  if (i % 2 === 0) {\n    // we're on an even index\n  }\n\n  i++;\n}\n\nverify();\n";

module.exports = {
  title: "for( ) the love of loops",
  description: "Now that we've covered the <code>while</code> loop, it's time to take a look at its twin sister: the <code>for</code> loop. Iterate through the array using a <code>for</code> loop, and log the content for all <em>even</em> indices.",
  initialText: initialText,
  blacklist: ["WhileStatement"],
  nestedRules: {
    ForStatement: {
      IfStatement: {
        required: true
      }
    }
  },
  customRules: [{
    description: "Program must have the word 'foobar' in it",
    fn: function fn(code) {
      return code.indexOf("foobar") > -1;
    }
  }],
  output: {
    description: "Program must pass the string \"winner!\" into the verify function",
    fn: function (str) {
      return str === "winner!";
    }
  }
};

},{}],3:[function(require,module,exports){
"use strict";

var initialText = "[0,1,2,3,4,5].map(verify);\nn => this;\n";

module.exports = {
  title: "Arrow functions",
  description: "Arrow functions let you define functions with a shorter syntax than standard <code>function</code> expressions. They also lexically bind the <code>this</code> value, so you don't need to <code>.bind(this)</code> as frequently!",
  initialText: initialText,
  whitelist: ["ArrowFunctionExpression"],
  blacklist: ["FunctionExpression"],
  nestedRules: {
    ArrowFunctionExpression: {
      ThisExpression: {
        required: true
      }
    }
  },
  customRules: [{
    description: "Program must be under 40 characters",
    fn: function (str) {
      return str.length < 40;
    }
  }],
  output: {
    description: "Program must call the verify function on the numbers 0 through 5, in order",
    fn: (function () {
      var nums = [0, 1, 2, 3, 4, 5];

      return function (i) {
        if (i === nums[0]) nums.shift();
        return nums.length === 0;
      };
    })()
  }
};

},{}]},{},[1]);

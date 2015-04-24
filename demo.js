(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var single = require("./challenges/1");
var series = [require("./challenges/2"), require("./challenges/3"), require("./challenges/4")];

var sticky = false;
var squished = false;
var stickyBoundary, squishedBoundary;

var body = document.body;
var singleBtn = document.getElementById("single");
var seriesBtn = document.getElementById("series");

function checkScroll(event) {
  var scrollTop = document.body.scrollTop;

  if (scrollTop >= stickyBoundary !== sticky) {
    sticky = !sticky;
    body.className = sticky ? "sticky" : "";
  } else if (scrollTop >= squishedBoundary !== squished) {
    squished = !squished;
    body.className = squished ? "sticky squished" : sticky ? "sticky" : "";
  }
}

function updateSizes() {
  var innerHeight = window.innerHeight;

  stickyBoundary = innerHeight - 96;
  squishedBoundary = innerHeight + 96;

  checkScroll();
}

function runCourse(course) {
  return function () {
    body.style.overflow = "hidden";
    challenger(course, {
      onExit: function onExit(success) {
        body.style.overflow = "auto";
      } });
  };
}

updateSizes();
window.addEventListener("resize", updateSizes);
document.addEventListener("scroll", checkScroll);

singleBtn.addEventListener("click", runCourse(single), false);
seriesBtn.addEventListener("click", runCourse(series), false);

hljs.initHighlightingOnLoad();

},{"./challenges/1":2,"./challenges/2":3,"./challenges/3":4,"./challenges/4":5}],2:[function(require,module,exports){
"use strict";

var initialCode = "function fizzbuzz (n) {\n  // ...\n}";

var fizzbuzz = function (i) {
  return (i % 3 ? "" : "Fizz") + (i % 5 ? "" : "Buzz") || i;
};
var testInputs = [24, 55, 15, 16, 120000];
var expectedOutput = testInputs.map(fizzbuzz);

module.exports = {
  title: "fizzbuzz in a tweet",
  description: "Write a function called <code>fizzbuzz</code> that accepts a single argument <code>n</code>. <code>fizzbuzz</code> should return \"Fizz\" if <code>n</code> is a multiple of 3, \"Buzz\" if <code>n</code> is a multiple of 5, “FizzBuzz” if <code>n</code> is a multiple of both 3 and 5, and <code>n</code> if <code>n</code> is a multiple of neither 3 nor 5.",
  initialCode: initialCode,
  customRules: [{
    description: "Program must fit within a tweet (max 140 characters)",
    verify: function verify(code) {
      return code.length <= 140;
    }
  }],
  output: {
    description: "Program must correctly implement a fizzbuzz function",
    verify: function () {
      for (var _len = arguments.length, output = Array(_len), _key = 0; _key < _len; _key++) {
        output[_key] = arguments[_key];
      }

      return output.every(function (n, i) {
        return n == expectedOutput[i];
      });
    },
    teardown: "__verify__(...[" + testInputs + "].map(fizzbuzz));" } };

},{}],3:[function(require,module,exports){
"use strict";

var initialCode = "[0,1,2,3,4,5].map(verify);\nn => this;\n";

var nums = [0, 1, 2, 3, 4, 5];

module.exports = {
  title: "Arrow functions",
  description: "Arrow functions let you define functions with a shorter syntax than standard <code>function</code> expressions. They also lexically bind the <code>this</code> value, so you don't need to <code>.bind(this)</code> as frequently!",
  initialCode: initialCode,
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
    verify: function (str) {
      return str.length < 40;
    }
  }],
  output: {
    description: "Program must call the function \"verify\" on the numbers 0 through 5, in order",
    setup: "var verify = __verify__;",
    verify: function verify(i) {
      if (i === nums[0]) nums.shift();
      return nums.length === 0;
    } }
};

},{}],4:[function(require,module,exports){
"use strict";

var initialCode = "var array = ['Donde', 'Esta', 'La', 'Biblioteca'];\n\nvar i = 0;\nwhile (i < array.length) {\n  if (i % 2 === 0) {\n    // we're on an even index\n  }\n\n  i++;\n}\n\nverify();\n";

module.exports = {
  title: "for( ) the love of loops",
  description: "Now that we've covered the <code>while</code> loop, it's time to take a look at its twin sister: the <code>for</code> loop. Iterate through the array using a <code>for</code> loop, and log the content for all <em>even</em> indices.",
  initialCode: initialCode,
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
    verify: function verify(code) {
      return code.indexOf("foobar") > -1;
    }
  }],
  output: {
    description: "Program must pass the string \"winner!\" into the verify function",
    setup: "var verify = __verify__;",
    verify: function (str) {
      return str === "winner!";
    } }
};

},{}],5:[function(require,module,exports){
"use strict";

var initialCode = "[0,1,2,3,4,5].map(verify);\nn => this;\n";

var nums = [0, 1, 2, 3, 4, 5];

module.exports = {
  title: "Arrow functions",
  description: "Arrow functions let you define functions with a shorter syntax than standard <code>function</code> expressions. They also lexically bind the <code>this</code> value, so you don't need to <code>.bind(this)</code> as frequently!",
  initialCode: initialCode,
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
    verify: function (str) {
      return str.length < 40;
    }
  }],
  output: {
    description: "Program must call the function \"verify\" on the numbers 0 through 5, in order",
    setup: "var verify = __verify__;",
    verify: function verify(i) {
      if (i === nums[0]) nums.shift();
      return nums.length === 0;
    } }
};

},{}]},{},[1]);

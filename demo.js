(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var single = require("./challenges/1");
var series = [require("./challenges/2"), require("./challenges/3")];

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

},{"./challenges/1":2,"./challenges/2":3,"./challenges/3":4}],2:[function(require,module,exports){
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

var initialCode = "// the array `numbers` is already defined for you\nvar squares = numbers.map(n => /* ??? */);\n";

var testInputs = [234, 114, -89, 90, 45, 0, 1];
var expectedOutput = testInputs.map(function (n) {
  return n * n;
});

module.exports = {
  title: "Square up",
  description: "An arrow function lets you use a shorter syntax than a standard <code>function</code>. It implicitly returns its expression, so there's no need for a <code>return</code> statement. Complete the example below to save an array of squared numbers to <code>squared</code>.",
  initialCode: initialCode,
  whitelist: ["ArrowFunctionExpression"],
  blacklist: ["FunctionDeclaration"],
  output: {
    description: "Program must save the squared `numbers` array into `squares`",
    setup: "var numbers = [" + testInputs + "];",
    verify: function () {
      for (var _len = arguments.length, output = Array(_len), _key = 0; _key < _len; _key++) {
        output[_key] = arguments[_key];
      }

      return output.every(function (n, i) {
        return n == expectedOutput[i];
      });
    },
    teardown: "__verify__(...squares);"
  }
};

},{}],4:[function(require,module,exports){
"use strict";

var initialCode = "function Cat () {\n  this.age = 0;\n\n  // some cats age quickly...\n  setInterval((function () {\n    ++this.age;\n  }).bind(this), 100);\n}\n";

module.exports = {
  title: "<code>this</code> rules!",
  description: "Arrow functions also lexically bind the <code>this</code> value, so you don't need to use tricks like <code>var that = this</code> or <code>.bind(this)</code>. Try refactoring the constructor below to use arrow functions.",
  initialCode: initialCode,
  nestedRules: {
    FunctionDeclaration: {
      ArrowFunctionExpression: {
        ThisExpression: { required: true }
      },
      FunctionExpression: {
        ThisExpression: { required: false }
      } }
  },
  output: {
    description: "Program must increment the Cat's age every 100ms using an arrow function",
    verify: function (age) {
      return age > 0;
    },
    teardown: "var meow = new Cat(); setTimeout(_ => __verify__(meow.age), 300);"
  }
};

},{}]},{},[1]);

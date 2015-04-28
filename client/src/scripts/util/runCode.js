var babel = require('babel');

// exposes global variable `operative`
require('operative');
operative.setSelfURL('./operative.min.js');

function runCode (code, verify, trigger) {
  var worker = operative(function (__code__, __verify__) {
    eval(__code__);
  });

  // transform our code string from es6 to es5
  var es5 = babel.transform(code, {
    ast: false,
    blacklist: ['useStrict'],
  }).code;

  // ensure that long-running plugins eg. while(1) will
  // halt execution after 700ms
  var limitExecutionTime = setTimeout(() => {
    worker.terminate();
    trigger(false);
  }, 700);

  // clean up the worker and timeout if we finish early
  function earlyExit () {
    clearTimeout(limitExecutionTime);
    worker.terminate();
  }

  var passed = false;
  // latchedVerify only needs to be correct once for passed to === true
  function latchedVerify (...args) {
    if (!passed && verify(...args)) {
      earlyExit();
      passed = true;
      trigger(true);
    }
  }

  // finally, spawn our worker
  worker(es5, latchedVerify);

  return earlyExit;
}

module.exports = runCode;

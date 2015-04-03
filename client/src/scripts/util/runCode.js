var jailed = require('jailed');
var babel = require('babel');

function runCode (code, verify, trigger) {
  function err (msg) {
    console.log(`Your code just threw an error: ${msg}`);
  }

  // wrap the verify function so that only one call needs
  // to return true to flip `wasSuccessful` to true
  var wasSuccessful = false;
  function verifyInPlugin (...args) {
    if (!wasSuccessful) wasSuccessful = verify(...args);
  }

  // transform our code string from es6 to es5
  var es5 = babel.transform(code, { ast: false }).code;

  // make our code plugin-ready by adding references to tunneled functions
  // and wrapping it all in a try/catch block. \n wraps on `es5` string
  // because babel can do wonky things with comment placement...
  var pluginCode = 'var verify = application.remote.verifyInPlugin;' +
    'try {\n' + es5 + '\n} catch (e) {application.remote.err(e.message);}' +
    'application.disconnect();';

  // create and start the plugin
  var plugin = new jailed.DynamicPlugin(pluginCode, { err, verifyInPlugin });

  // ensure that long-running plugins eg. while(1) will
  // halt execution after 450ms
  var limitExecutionTime = setTimeout(() => {
    plugin.disconnect();
    console.log('Your code is taking too long to run; check your loops!');
  }, 450);

  plugin.whenDisconnected(() => {
    clearTimeout(limitExecutionTime);
    trigger(wasSuccessful);
  });
};

// debounce the exported function so that it's only run after
// typing has paused for 450ms
var debounceTimeout;
module.exports = function debouncedRunCode (...args) {
  clearTimeout(debounceTimeout);
  // TODO: strange behaviour when this is dropped to setTimeout("", 0)
  debounceTimeout = setTimeout(() => runCode(...args), 450);
};

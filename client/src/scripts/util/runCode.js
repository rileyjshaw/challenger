var jailed = require('jailed');
var babel = require('babel');

function runCode (code, verify) {
  function err (msg) {
    console.log(`Your code just threw an error: ${msg}`);
  }

  // wrap the verify function so that we can see if it's
  // called during our plugin's execution
  var verifyCalled = false;
  function verifyFromWithinPlugin (...args) {
    verify(true, ...args);
    verifyCalled = true;
  }

  // transform our code string from es6 to es5
  var es5 = babel.transform(code, { ast: false }).code;

  // make our code plugin-ready by adding references to tunneled
  // functions and wrapping it all in a try/catch block
  var pluginCode = 'var verify = application.remote.verifyFromWithinPlugin;' +
    'try {' + es5 + '} catch (e) {application.remote.err(e.message);}' +
    'application.disconnect();';

  // create and start the plugin
  var plugin = new jailed.DynamicPlugin(pluginCode, { err, verifyFromWithinPlugin });

  // ensure that long-running plugins eg. while(1) will
  // halt execution after 450ms
  var limitExecutionTime = setTimeout(() => {
    plugin.disconnect();
    console.log('Your code is taking too long to run; check your loops!');
  }, 450);

  // if verify() wasn't called in the plugin, call verify
  // with its first argument (inPlugin) set to false
  plugin.whenDisconnected(() => {
    clearTimeout(limitExecutionTime);
    if (!verifyCalled) verify(false);
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

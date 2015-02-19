// reflux actions
//
var Reflux = require('reflux');

var actions = Reflux.createActions([
  'challengeUpdate',
  'codeEditUser',
  // replaces text in CodeMirror
  'codeEditOverride'
]);

module.exports = actions;

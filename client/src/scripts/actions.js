// reflux actions
//
var Reflux = require('reflux');

var actions = Reflux.createActions([
  'loadCourse',
  'challengeCompleted',
  'codeEditUser',
  // replaces text in CodeMirror
  'codeEditOverride'
]);

module.exports = actions;

var React = require('react');
var CodeMirror = require('codemirror');

var Reflux = require('reflux');
var codeEditUser = require('../actions').codeEditUser;
var codeEditOverride = require('../actions').codeEditOverride;
var challengeStore = require('../stores/challenge');

// set JSHINT as a global...
window.JSHINT = require('jshint').JSHINT;

// ...so codemirror can access it in the following addons:
require('codemirror/mode/javascript/javascript');
require('codemirror/addon/lint/lint');
require('codemirror/addon/lint/javascript-lint');

var Editor = React.createClass({
  mixins: [Reflux.listenTo(challengeStore, 'onChallengeStoreChange')],

  componentDidMount() {
    var cm = CodeMirror.fromTextArea(this.getDOMNode(), {
      autofocus: true,
      gutters: ['CodeMirror-lint-markers'],
      lineNumbers: true,
      lint: { esnext: true },
      mode: 'javascript',
      styleActiveLine: true,
      theme: 'neo',
      indentWithTabs: false,
      tabSize: 2,
    });
    this.cm = cm;

    this.getText = cm.doc.getValue.bind(cm.doc);
    this.setText = cm.doc.setValue.bind(cm.doc);
    cm.on('change', this.onChange);

    codeEditOverride();
    this.onChange();
  },

  onChallengeStoreChange(newText) {
    if (typeof newText === 'string') {
      this.setText(newText);

      // set focus to the end of the second last line
      this.cm.doc.setCursor(this.cm.doc.lineCount() - 2, 1000);
    }
  },

  onChange() {
    codeEditUser(this.getText());
  },

  componentWillUnmount() {
    this.cm.off('change', this.onChange);
    delete this.getText;
    delete this.setText;

    this.cm.toTextArea();
  },

  render() {
    // textarea will be gobbled up by CodeMirror;
    // set it to readOnly to hush the compiler
    return (
      <textarea readOnly={true} />
    );
  },
});

module.exports = Editor;

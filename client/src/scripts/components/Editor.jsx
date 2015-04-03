var React = require('react');
var CodeMirror = require('codemirror');

var Reflux = require('reflux');
var codeEditUser = require('../actions').codeEditUser;
var codeStore = require('../stores/code');

// set JSHINT as a global...
window.JSHINT = require('jshint').JSHINT;

// ...so codemirror can access it in the following addons:
require('codemirror/mode/javascript/javascript');
require('codemirror/addon/lint/lint');
require('codemirror/addon/lint/javascript-lint');

var Editor = React.createClass({
  mixins: [Reflux.listenTo(codeStore, 'onCodeStoreChange')],

  componentDidMount() {
    // TODO: Invisible cursor in ie8
    var cm = this.cm = CodeMirror.fromTextArea(this.getDOMNode(), {
      autofocus: true,
      gutters: ['CodeMirror-lint-markers'],
      lineNumbers: true,
      lint: { esnext: true },
      mode: 'javascript',
      styleActiveLine: true,
      theme: 'neo'
    });

    this.getText = cm.doc.getValue.bind(cm.doc);
    this.setText = cm.doc.setValue.bind(cm.doc);
    cm.on('change', this.onChange);

    this.onChange();
  },

  onCodeStoreChange(newText) {
    var doc = this.cm.doc;
    if (typeof newText === 'string') {
      this.setText(newText);

      // set focus to the end of the second last line
      doc.setCursor(doc.lineCount() - 2, 1000);
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

var React = require('react');
var UI = require('./components/UI.jsx');
var loadCourse = require('./actions').loadCourse;

function challenger (course, {
  parent = document.body,
  onExit = (success) => null,
  successText,
}) {
  function unmount (success) {
    onExit(success);
    React.unmountComponentAtNode(container);
    parent.removeChild(container);
  }

  var container = document.createElement('div');
  container.className = 'challenger';
  parent.appendChild(container);

  React.render(<UI unmount={unmount} successText={successText} />, container);
  loadCourse(course);
}

module.exports = challenger;

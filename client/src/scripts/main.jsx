var React = require('react');
var UI = require('./components/UI.jsx');
var loadCourse = require('./actions').loadCourse;

function challenger (course, {
  parent = document.body,
  onExit = (success) => null,
  successText = {
    before: 'Way to go!',
    after: 'You just passed the final exercise of this course.',
  }
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

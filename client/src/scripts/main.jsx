// ie8
require('es5-shim');
require('es5-shim/es5-sham');
require('console-polyfill');

var React = require('react');
var UI = require('./components/UI.jsx');
var loadCourse = require('./actions').loadCourse;

function challenger (course, parent = document.body) {
  function unmount () {
    React.unmountComponentAtNode(container);
    parent.removeChild(container);
  }

  var container = document.createElement('div');
  container.className = 'challenger';
  parent.appendChild(container);

  React.render(<UI unmount={unmount} />, container);
  loadCourse(course);
}

// TODO: Move these out into their own demo module
var course = [require('./challenges/1'), require('./challenges/2')];
challenger(course);

module.exports = challenger;

// ie8
require('es5-shim');
require('es5-shim/es5-sham');
require('console-polyfill');

var React = require('react');
var UI = require('./components/UI.jsx');

var loadCourse = require('./actions').loadCourse;

function render (el) {
  React.render(<UI />, el);
}

// TODO: Move these out into their own demo module
render(document.getElementById('react-container'));
loadCourse([require('./challenges/2'), require('./challenges/1')]);

module.exports = {
  render,
  loadCourse,
};

// ie8
require('es5-shim');
require('es5-shim/es5-sham');
require('console-polyfill');

var React = require('react');
var UI = require('./components/UI.jsx');

var challengeUpdate = require('./actions').challengeUpdate;
var challenge = require('./challenges/1');

React.render(
  <UI />,
  document.getElementById('react-container')
);

challengeUpdate(challenge);

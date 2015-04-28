var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;

function createPureClass (specification) {
  if (!specification.mixins){
    specification.mixins = [];
  }

  specification.mixins.push(PureRenderMixin);
  return React.createClass(specification);
}

// allow for single-line require
module.exports = {React, createPureClass};

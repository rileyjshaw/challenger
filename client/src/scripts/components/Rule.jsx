var {React, createPureClass} = require('../util/createPureClass.js');
var Spinner = require('./Spinner.jsx');

var Rule = createPureClass({
  propTypes: {
    description: React.PropTypes.node.isRequired, // string or array
    required: React.PropTypes.bool.isRequired,
    present: React.PropTypes.bool.isRequired,
    blocked: React.PropTypes.bool
  },

  render() {
    var { description, required, present, blocked } = this.props;

    var className = blocked ? 'blocked' :
      present === required ? 'complete' : 'incomplete';

    return (
      <li className={className}>
        <p>{description}.</p>
        <Spinner radius={12} />
      </li>
    );
  },
});

module.exports = Rule;

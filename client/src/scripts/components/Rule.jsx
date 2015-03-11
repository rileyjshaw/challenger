var {React, createPureClass} = require('../util/createPureClass.js');

var Rule = createPureClass({
  propTypes: {
    description: React.PropTypes.node.isRequired, // string or array
    required: React.PropTypes.bool.isRequired,
    present: React.PropTypes.bool.isRequired,
    blocked: React.PropTypes.bool
  },

  render() {
    // destructure this.props
    var { description, required, present, blocked } = this.props;

    var className = blocked ? 'blocked' :
      present === required ? 'complete' : 'incomplete';

    return (
      <li className={className}>
        <p>{description}.</p>
      </li>
    );
  },
});

module.exports = Rule;

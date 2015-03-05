var {React, createPureClass} = require('../util/createPureClass.js');

var Rule = createPureClass({
  propTypes: {
    description: React.PropTypes.node.isRequired, // string or array
    required: React.PropTypes.bool.isRequired,
    present: React.PropTypes.bool.isRequired
  },

  render() {
    // destructure this.props
    var { description, required, present } = this.props;
    var instructions = `Program must ${required ? '' : 'not '}`;

    return (
      <li className={present === required ? 'complete' : 'incomplete'}>
        <p>{instructions}{description}.</p>
      </li>
    );
  },
});

module.exports = Rule;

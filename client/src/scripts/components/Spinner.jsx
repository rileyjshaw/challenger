var {React, createPureClass} = require('../util/createPureClass.js');

var Spinner = createPureClass({
  propTypes: {
    radius: React.PropTypes.number.isRequired
  },

  render() {
    var r = this.props.radius;
    var size = r * 2 + r / 4;
    var style = { width: size, height: size, margin: -size / 2 };

    return (
      <div className='spinner'>
        <svg style={style}>
          <circle
            cx={r + r / 8}
            cy={r + r / 8}
            r={r}
            strokeWidth={r / 4}
          />
        </svg>
      </div>
    );
  }
});

module.exports = Spinner;

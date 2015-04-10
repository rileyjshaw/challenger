var {React, createPureClass} = require('../../util/createPureClass.js');

var style = {
  line: {
    stroke: '#e8cfff',
    strokeWidth: 2,
    fill: 'none',
    transition: 'stroke 0.2s',
  },
};

var X = createPureClass({
  propTypes: {
    size: React.PropTypes.number.isRequired
  },

  render() {
    var s = this.props.size;
    var lo = s / 12;
    var hi = lo * 11;

    return (
      <svg width='100%' height='100%' viewBox={`0 0 ${s} ${s}`} preserveAspectRatio='none'>
        <g>
          <line style={style.line} x1={lo} y1={hi} x2={hi} y2={lo}></line>
          <line style={style.line} x1={hi} y1={hi} x2={lo} y2={lo}></line>
        </g>
      </svg>
    );
  }
});

module.exports = X;

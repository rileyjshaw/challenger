var React = require('react');

var ChallengeEditor = React.createClass({
  getInitialState() {
    return {
      rules: []
    };
  },

  render() {
    return (
      <div>
        <h1>Create Challenge</h1>
        <p>Program
          <select name='select'>
            <option value='true' selected>must</option>
            <option value='false'>must not</option>
          </select>
          contain a
          <input type='text' />
        </p>
      </div>
    );
  },
});

module.exports = ChallengeEditor;

# Challenger

**DEMO: http://rileyjshaw.com/challenger**

## Creating custom exercises

Challenges are simple JavaScript objects with the following optional keys:

 - `title`: Title of the challenge
 - `description`: A short description of the challenge
 - `initialCode`: Text to be loaded into the code editor on initialization
 - `whitelist`: An array of [ParserAPI](https://developer.mozilla.org/en-US/docs/Mozilla/Projects/SpiderMonkey/Parser_API) strings, indicating expressions that **must** exist in the student's code
 - `blacklist`: Same as `whitelist`, but these expressions **must not** exist in the student's code
 - `nestedRules`: An object indicating nested requirements. Naming conventions are consistent with the `whitelist` and `blacklist`, but each expression key can take another nested object as its value. Setting the `required` attribute on an expression indicates whether the expression is required or disallowed. For example:

  ```javascript
  var challenge = {
    // ...
    nestedRules: {
      WhileStatement: {
        IfStatement: {
          required: true
        },
        ForStatement: {
          required: false
        }
      }
    }
  };
  ```

  Indicates that the student **must** include an `if` statement within a `while` statement in their code, but **must not** include a `for` statement within a `while` statement.
 - `customRules`: An array of objects. Each object must have a `fn` key set to a function which takes the current user input as a string and returns a boolean dependent on if the rule is satisfied. Each object must also have a `description` key to describe the rule. For example:

  ```javascript
  customRules: [
    {
      description: 'Program must have the word \'foobar\' in it',
      fn: function (str) { return str.indexOf('foobar') > -1; }
    },
    {
      description: 'Program must be under 140 characters',
      fn: function (str) { return str.length < 140; }
    }
  ]
  ```

 - `output`: An object with a `fn` key that will be aliased to the `verify` function in the challenge, and a `description` key describing the function. For example:

  ```javascript
  output: {
    description: 'Program must pass the string "winner!" into the verify function',
    fn: (str) => str === 'winner!'
  }
  ```

To load a single challenge, pass its object into the `loadCourse` method:

```javascript
var challenger = require('challenger');

var newChallenge = {
  title: 'My new challenge',
  description: 'It\'s all about the Pentiums.',
  whitelist: ['DoWhileStatement']
};

challenger.loadCourse(newChallenge);
```

To create a course out of multiple challenges in sequence, pass an array of challenges into the `loadCourse` method:

```javascript
// ...
challenger.loadCourse([challenge1, challenge2, challenge3/*, ... */]);
```

That's it, you're good to go!

## Next steps

 - Challenge editor: since challenges are just JavaScript objects, it would be easy to create a front-end for challenge creation. This would be a useful tool, especially if names from the [ParserAPI](https://developer.mozilla.org/en-US/docs/Mozilla/Projects/SpiderMonkey/Parser_API) were presented in a friendly way.
 - ~~Multiple challenges in a row: the description for the current demo was written as though there had been a prior challenge. Solving a quick challenge before advancing to the next would be a great experience. I wrote the app with this in mind; state is centralized, data flow is unidirectional under the Flux architecture, and all methods on the sides of the application are immutable. This means that changing challenges is really as easy as calling `challengeUpdate(newChallengeObj)`.~~
 - ~~Custom rules: the current testing API allows us to analyze code structure but does not allow for much flexibility beyond that. Allowing instructors to add requirements like "Variable names must be English words" or "Program must be less than 140 characters" would open up the framework for new possibilities. Such tests could be added through a short extension of [`parseChallenge`](client/src/scripts/util/parseChallenge.js).~~
 - ~~Styling: when you spend an afternoon creating a prototype, it doesn't always come out looking great. Spending a bit more time on cross-device styling would be a nice touch.~~
 - ~~Code evaluation: for simple exercises like this to be useful, it's important to evaluate the code. Since we don't want to run untrusted code on the main thread (`while(1)`, anyone?), it would make sense to evaluate code client-side in a Worker with a ceiling on execution time.~~
 - ...and on the server: it would be great to have a local "Test" button and a "Submit" button that verifies code server-side. Execution on the server would have to be sandboxed, also with a ceiling on execution time.

## That's all, folks
[@rileyjshaw](http://rileyjshaw.com)

## Licence
[MIT](LICENSE)

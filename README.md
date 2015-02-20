# Challenge Framework

**DEMO: http://rileyjshaw.com/challenge-framework**

**Time to build: ~7 hours**

**Time wasted trying to get gulp to build my damn sourcemaps through 6to5, Reactify, and UglifyJS: ~6.75 hours**

Created for Khan Academy.

## The problem

Analyze student-generated JS and determine if certain aspects are written as expected.

 > We want this so that we can provide advanced unit testing for a student's program ­- be able to provide them with informed feedback (that's better than what normal unit testing can provide, but likely not as good as what a human could provide).

Notably, there are three required interfaces for our testing framework:

 > - A **whitelist** of specific functionality. For example, the ability to say "This program MUST use a 'for loop' and a 'variable declaration'."
 > - A **blacklist** of specific functionality. For example, the ability to say "This program MUST NOT use a 'while loop' or an 'if statement'."
 > - Determine the rough **structure** of the program. For example, "There should be a 'for loop' and inside of it there should be an 'if statement'."

## The solution

A great part of the IDE experience is the instant, seamless error-checking and feedback that you get while writing code. Especially when learning new features or touching unfamiliar code bases, smart, live error-reporting is key.

Since this is a tool for students, I knew upfront that I wanted to check code validity and update visual cues on each keystroke. With data flowing in a constant stream from the editor, it would be easy to fall into confusing state machines and race conditions. One of my first major decisions was to use React to encourage a unidirectional flow of data through the application[<sup>1</sup>](#n1).

I chose [Acorn](https://github.com/marijnh/acorn) as a parser because it consistently beats out [Esprima](http://esprima.org/test/compare.html) in speed tests. Speed is important since Acorn is run on every keystroke. Another thing that Acorn has going for it is that it's about half the size of Esprima. With React, CodeMirror, and the shims required for IE8 quickly launching my app's size to the moon, I was happy to save a few bytes with Acorn.

As the page loads, a challenge object is initialized and passed in to the app's state. As the user types, their code is evaluated and linted asynchronously[<sup>2</sup>](#n2), which in turn updates the app's state (including the pass / fail state of tests).

<sup id="n1">1</sup>: At first I went fully functional reactive, and created a Flux-like architecture using [Kefir.js](https://pozadi.github.io/kefir/) (similar to [RxJS](http://reactive-extensions.github.io/RxJS/) or [Bacon.js](https://baconjs.github.io/)). Once I'd thought more about the problem I realized that I didn't need the functional transforms and compositions that Kefir offers, so I opted for the convenience of [Reflux.js](https://github.com/spoike/refluxjs) instead.

<sup id="n2">2</sup>: I considered using Web Workers to handle this work in a background thread. After running some tests on Acorn and JSHint I decided that the marginal efficiency gains on modern browsers weren't worth the complexity of supporting older browsers. Even if the exercises were being parsed synchronously, they would have to grow to a substantial size before parsing time exceeded the delay between keystrokes.

## Challenges along the way

I'm happy that I used Acorn, but going with Esprima would have been easier. With a fuller API and some strong projects like [Estraverse](https://www.npmjs.com/package/estraverse), writing a recursive "am I in the proper nested structure" function would have been a breeze. With Acorn, I ended up with the [Code Store](client/src/stores/code.js), which relies on keeping the results of an AST walk within a larger closure[<sup>3</sup>](#n3). Were I to start this project over, I would likely extend Acorn's walk function to simplify this part of the codebase.

Another challenge with Acorn is that it exits on its first parseError. If there are multiple bugs in the code you're parsing, good luck finding them. Since error reporting was one of my central goals (and because I was pressed for time) I hooked up JSHint to do a sweep whenever the code changes. This means that for each change event, I'm actually parsing the code twice. It would be nice to package this into a single sweep. One solution is to restart Acorn on the next line in case of an error. Not only does this solve our problem, but it also allows expressions that occur after the first error to be evaluated, and state to be updated accordingly.

<sup id="n3">3</sup>: It's worth noting that my walk function *is* more efficient than a less targeted solution... but not considerably so.

## Creating custom exercises

Challenges are simple JavaScript objects with the following optional keys:

 - `title`: Title of the challenge
 - `description`: A short description of the challenge
 - `initialText`: Text to be loaded into the code editor on initialization
 - `whitelist`: An array of [ParserAPI](https://developer.mozilla.org/en-US/docs/Mozilla/Projects/SpiderMonkey/Parser_API) strings, indicating expressions that **must** exist in the student's code
 - `blacklist`: Same as `whitelist`, but these expressions **must not** exist in the student's code
 - `structure`: An object indicating nested requirements. Naming conventions are consistent with the `whitelist` and `blacklist`, but each expression key can take another nested object as its value. Setting the `required` attribute on an expression indicates whether the expression is required or disallowed. For example:

  ```javascript
  var challenge = {
    // ...
    structure: {
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

To load a custom challenge, pass its object into the `challengeUpdate` action:

```javascript
var challengeUpdate = require('../actions').challengeUpdate;

var newChallenge = {
  title: 'My new challenge',
  description: 'It\'s all about the Pentiums.',
  whitelist: ['DoWhileStatement']
};

challengeUpdate(newChallenge);
```

That's it, you're good to go!

## Next steps

 - Challenge editor: since challenges are just JavaScript objects, it would be easy to create a front-end for challenge creation. This would be a useful tool, especially if names from the [ParserAPI](https://developer.mozilla.org/en-US/docs/Mozilla/Projects/SpiderMonkey/Parser_API) were presented in a friendly way.
 - Multiple challenges in a row: the description for the current demo was written as though there had been a prior challenge. Solving a quick challenge before advancing to the next would be a great experience. I wrote the app with this in mind; state is centralized, data flow is unidirectional under the Flux architecture, and all methods on the sides of the application are immutable. This means that changing challenges is really as easy as calling `challengeUpdate(newChallengeObj)`.
 - Custom rules: the current testing API allows us to analyze code structure but does not allow for much flexibility beyond that. Allowing instructors to add requirements like "Variable names must be English words" or "Program must be less than 140 characters" would open up the framework for new possibilities. Such tests could be added through a short extension of [`parseChallenge`](client/src/scripts/util/parseChallenge.js).
 - Styling: when you spend an afternoon creating a prototype, it doesn't always come out looking great. Spending a bit more time on cross-device styling would be a nice touch.
 - Code evaluation: for simple exercises like this to be useful, it's important to evaluate the code. Since we don't want to run untrusted code on the main thread (`while(1)`, anyone?), it would make sense to evaluate code client-side in a Worker with a ceiling on execution time.
 - ...and on the server: it would be great to have a local "Test" button and a "Submit" button that verifies code server-side. Execution on the server would have to be sandboxed, also with a ceiling on execution time.

## That's all, folks
[@rileyjshaw](http://rileyjshaw.com)

## Licence
[MIT](LICENSE)

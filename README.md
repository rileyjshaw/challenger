# Challenger
_Pop-up JavaScript challenges in your browser_

Challenger is a drop-in JavaScript library that adds interactive programming challenges to any page. Challenges are flexible and expressive, and are super simple to write.

A challenge has requirements based on code structure and program output, and gives users a code editor to experiment in. When new code is written, it's run in a sandbox and the output is analyzed.

Challenges can be presented as one-off tests or linked together to form courses.

## Docs
For full documentation including usage examples, visit the [main project page](http://rileyjshaw.com/challenger).

## Roadmap

 - ~~Multiple challenges in a row: Solving a quick challenge before advancing to the next would be a great experience. I wrote the app with this in mind; state is centralized, data flow is unidirectional under the Flux architecture, and all methods on the sides of the application are immutable. This means that changing challenges is really as easy as calling `challengeUpdate(newChallengeObj)`.~~
 - ~~Custom rules: the current testing API allows us to analyze code structure but does not allow for much flexibility beyond that. Allowing instructors to add requirements like "Variable names must be English words" or "Program must be less than 140 characters" would open up the framework for new possibilities. Such tests could be added through a short extension of [`parseChallenge`](client/src/scripts/util/parseChallenge.js).~~
 - ~~Styling: when you spend an afternoon creating a prototype, it doesn't always come out looking great. Spending a bit more time on cross-device styling would be a nice touch.~~
 - ~~Code evaluation: for simple exercises like this to be useful, it's important to evaluate the code. Since we don't want to run untrusted code on the main thread (`while(1)`, anyone?), it would make sense to evaluate code client-side in a Worker with a ceiling on execution time.~~
 - ...and on the server: it would be great to have a local "Test" button and a "Submit" button that verifies code server-side. Execution on the server would have to be sandboxed, also with a ceiling on execution time.
 - ~~Add `setup` and `teardown` options to challenge objects, specifying code to run before & after the user-supplied code.~~
 - Fix CodeMirror rendering in older versions of Firefox.
 - **Reduce the bundle size.** This is a very important one, as we're currently weighing in at ~2M. There's a lot of bloat from redundant dependencies - if anyone has experience with this I'd really appreciate a hand.

## Browser support
Tested with [BrowserStack](https://www.browserstack.com/)

 - Chrome 18+
 - Firefox 34+
 - Opera 15+
 - Safari 5.1+
 - IE9+
 - Mobile Safari

If you need to support older browsers, include [krisowal's es5-shim](https://github.com/es-shims/es5-shim) along with `es5-sham.js` from the same repository. You might also need to tweak the CSS.

## Licence
[MIT](LICENSE)

## That's all, folks
[@rileyjshaw](https://twitter.com/rileyjshaw)

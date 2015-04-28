# Challenger v1.0.1
_Pop-up JavaScript challenges in your browser_

Challenger is a drop-in JavaScript library that adds interactive programming challenges to any page. Challenges are flexible and expressive, and are super simple to write.

A challenge has requirements based on code structure and program output, and gives users a code editor to experiment in. When new code is written, it's run in a sandbox and the output is analyzed.

Challenges can be presented as one-off tests or linked together to form courses.

## Docs
For full documentation including usage examples, visit the [main project page](http://rileyjshaw.com/challenger).

## Roadmap

 - [x] ~~Multiple challenges in a row~~
 - [x] ~~Custom rules~~
 - [x] ~~Styling~~
 - [x] ~~Code evaluation on the client~~
 - [ ] Code evaluation on the server
 - [x] ~~Add `setup` and `teardown` options to challenge objects~~
 - [x] ~~Fix CodeMirror rendering in older versions of Firefox~~
 - [ ] **Reduce the bundle size**

Reducing bundle size important, as we're currently weighing in at ~2M. There's a lot of bloat from redundant dependencies - if anyone has experience with this I'd really appreciate a hand.

## Browser support
Tested with [BrowserStack](https://www.browserstack.com/)

 - Chrome 18+
 - Firefox 9+
 - Opera 15+
 - Safari 5.1+
 - IE9+
 - Mobile Safari

If you need to support older browsers, include [krisowal's es5-shim](https://github.com/es-shims/es5-shim) along with `es5-sham.js` from the same repository. You might also need to tweak the CSS.

## Licence
[MIT](LICENSE)

## That's all, folks
[@rileyjshaw](https://twitter.com/rileyjshaw)

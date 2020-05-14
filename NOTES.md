### Server

- [Using babel to execute typescript](https://github.com/babel/babel/issues/6353)

- When using `extends` in `.eslintrc`, the ordering is important. Latter rules overwrite former rules.

- Using `plugin:@typescript-eslint/recommended` handled the issues of "not using interfaces" even though we were.

- [ESLint with Typescript imports](https://github.com/alexgorbatchev/eslint-import-resolver-typescript)

  - After a series of annoying Googles and searches for how to resolve "eslint import issues with typescript", we finally found `.eslintrc` configuration that worked. There may be extraneous typescript configurations. It's hard to tell because some configurations are needed for basic typescript linting. But at this point, we'll keep everything that's present. The import/extension rules and the import/resolver settings are definitely required. The others may just be related to proper typescript linting.

- [Creating "extensible" enums types](https://github.com/Microsoft/TypeScript/issues/17059#issuecomment-314156677)

  - This is really just a way to keep type safety and "extensibility" for "enums" in JS without trying to go too C#/type crazy. Makes perfect sense.
  - **_You should beware of the enum conflicts_** example that andy-ms gives. However, currently, there isn't likely to be an issue where, for instance, A "Red Card" in Uno would be mistaken for a "Red Card" in Codenames. This is analogous to GoodMusic.RockAndRoll being mistaken for BadMusic.Rap in andy's example, since both of them evaluate to 0. But we aren't doing things like switch case scenarios at the moment. And our decks will likely be isolated during gameplay anyway. If the decks are brought together, the cards may still be of "the same type" anyway so it still may not matter. In any case, for now things appear to be safe. But we should consider these potential problems in the future.
  - Also be aware that this is probably one of the few areas that is "more TS than JS" as a warning. We want to be as much JS as possible. But this is only a slight deviation that really just focuses on expressing types, which are already a part of TS anyway.

- `eslint` doesn't understand exporting types. It thinks you're exporting undefined. Nonetheless, the code still compiles. It seems eslint has a bug.

- For `export * as namespace from module`, you'll need the [babel plugin](https://babeljs.io/docs/en/babel-plugin-proposal-export-namespace-from), which we have installed. Notice that this was a proposal that has been merged...but `ES2020` is not out yet... [See this tc39 proposal](https://github.com/tc39/proposal-export-ns-from)

- For some reason, `Nullish Coalescing` and `Optional Chaining` are already in the babel preset that we're using. (It should be in ES2020 anyway.) We'll just take advantage of this.

  - Optional chaining [looks more powerful in JS than you'd think](https://github.com/tc39/proposal-optional-chaining). It's not just some simple C# syntax. It goes even further, like being able to use `obj?.[key]` (which makes for stuff like asking for dynamic properties).

- [Shuffling arrays in JS](https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array). This uses the [`Fisher-Yates` algorithm](https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#The_modern_algorithm), which is worth getting acquainted with...especially since it's simple.

- [Reservoir Sampling](https://en.wikipedia.org/wiki/Reservoir_sampling) is a way to sample `k` items from a population of size `n` **_without replacement_**. We used the "optimal" algorithm (assuming it's truly optimal), though we had to properly interpret the algorithm for a 0-indexed array.

- [Initializing and Array with number 1-N (or 0 to N-1)](https://stackoverflow.com/questions/3746725/how-to-create-an-array-containing-1-n).

- Common convention for functions in JavaScript like `forEach` is to name unused variables as `_`. For instance, `array.forEach((_, index => ...))`. If multiple unused variables are involved, then the common convention is to precede the variable name with an underscore (eg. `_item` instead of just `_`).

- It seems adding TypeScript can screw up some of the normal intellisense. For instance, in our React Retro project (at least currently), we didn't have to install any explicit types for `express`. But now (likley because we have TypeScript and a TS config), we have to specify the `express` types by installing them. Similar things will probably need to happen for webpack if you want good typing.

  - Types are very important when working with TypeScript. It can impact whether or not TypeScript even knows which overload you're using (and allows you to compile that overload). This makes us have to do some work with `process.env.PORT`.

- [Quick Simple Implementation for Unique ID's](https://gist.github.com/gordonbrander/2230317)

- [Warning about declarations in JavaScript switch/case. Use blocks!](https://eslint.org/docs/rules/no-case-declarations)

- [TypeScript now supports private fields in JavaScript](https://www.typescriptlang.org/docs/handbook/classes.html).

- [TC39 Private fields](https://github.com/tc39/proposal-class-fields). Note that private fields are **_different_** from private methods. It doesn't seem like TypeScript supports those yet.

  - If you use these, you'll need to update Babel, though. (At least until the new stuff gets merged.)

- [Thoughts on ordering parts of a class](https://softwareengineering.stackexchange.com/questions/199311/most-human-friendly-way-to-order-class-method-definitions). Note that some people prefer grouping public, private, protected methods, etc. But that may not always be helpful (if it's helpful at all.)

- [`Partial` can be used to make all the properties of an interface optional](https://stackoverflow.com/questions/39713349/make-all-properties-within-a-typescript-interface-optional).

- [`JSDocs` will be worth understanding at some point](https://jsdoc.app/). We started implementing some _very_ lightly in `Codenames.ts`.

### Quick Testing Server

- `Deck`
  - A quick way to test that your deck is working properly is simply to generate a new deck. Then, immediately shuffle it, and log it in the console. You'll find the size of the deck, as well as the array of cards particularly helpful to look at.
- `Codenames Game`
  - Testing a Codenames game may require a few runarounds. The simple way to do it is to use the `readline` built-in npm package. You can create an interface with the I/O streams using the `createInterface` method. Then, you can listen for events on the returned object. Use `rl.on("line", function(input))`. You can use it to force in your own cheaty actions as a player outside of the existing game. It should be quick enough, and you should easily be able to test win conditions. To observe other things like current player, you'll want to observe the `gameState`.
- Remember that ideally, we'd want real, robust tests. At least right now, card games can be treated like a `Redux Reducer` to some extent.

### Web

- [Helping ESLint resolve aliased imports](https://github.com/johvin/eslint-import-resolver-alias)

- TSconfig, among other things, can be used to help Visual Studio Code resolve aliased imports.

  - We pulled our typescript config from Vue's. (We excluded the webpack-env type though.)

- [Webpack vs. Webpack Dev Server vs. Webpack Hot Server vs. ...](https://stackoverflow.com/questions/42294827/webpack-vs-webpack-dev-server-vs-webpack-dev-middleware-vs-webpack-hot-middlewar)

- [Using Typescript with Vue via webpack](https://alexjover.com/blog/integrate-typescript-in-your-vue-project/)

  - [Reminder on using loaders with correct syntax](https://webpack.js.org/concepts/loaders/)

- [Using Typescript in Single File Components (SFC's)](https://alligator.io/vuejs/using-typescript-with-vue/)

- [Adding Hot Module Reloading](https://github.com/webpack-contrib/webpack-hot-middleware)

- [Add Vue without CLI](https://www.freecodecamp.org/news/how-to-create-a-vue-js-app-using-single-file-components-without-the-cli-7e73e5b8244f/)

- Note that the ESLint config seems very brittle when it comes to Vue. So be extremely careful with it.
  - [Using ESLint with Vue](https://vuejs.github.io/eslint-plugin-vue/user-guide/#installation). (Includes the complications of handling parsers.)
  - [Vue Component tags order](https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/component-tags-order.md)
  - [Vue Break on single line elements](https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/singleline-html-element-content-newline.md0). (No reasoning was given, this adds to lines of code, and it seems dumb...so no.)

### Web Sockets and Server-Sent Events

- Server-sent events allow a server to send information to the client. (Eg. the person in theh browser) It's only one way.
- Web Sockets allow both the client and the server to send messages back and forth.
- We found some good information on these topics that will be useful to know. Also remember that you have your own notes on [Node for Networking](https://github.com/XxX-MLGNoob-XxX/advanced-nodejs/tree/master/4-node-for-networking).
- `Server-sent Events`
  - [Excellent simple example of implementing server-sent events](https://auth0.com/blog/developing-real-time-web-applications-with-server-sent-events/). There are some places where the grammar is a little off. But the explanations are pretty solid.
  - [MDN Server-sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
  - [MDN Using Server-sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events)
  - [Event Source](https://developer.mozilla.org/en-US/docs/Web/API/EventSource). (Used by JS client for handling server sent events.)
- `Web Sockets`
  - [MDN Web Sockets API](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
  - [MDN Web Socket (JS object)](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
  - [Wikipedia on Web Sockets](https://en.wikipedia.org/wiki/WebSocket)
  - [Useful example of Web Sockets compared to Server-sent Events](https://medium.com/@joekarlsson/complete-guide-to-node-client-server-communication-b156440c029)
  - [Simple example of using Web Sockets with Express](https://medium.com/factory-mind/websocket-node-js-express-step-by-step-using-typescript-725114ad5fe4). (This one may be over simplified. We had to test stuff out on our own.)
  - [Web Socket NPM Package (`ws`)](https://github.com/websockets/ws). (This was the package used by the 2 previously listed examples. It seems to make things simpler than using Node's built in capabilities.)
- `Cross Origin Resource Sharing (CORS)`
  - [MDN on CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS). (This will just be good to read up on in general.)

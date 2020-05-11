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

### Web

- [Helping ESLint resolve aliased imports](https://stackoverflow.com/questions/47863102/eslint-error-showing-with-webpack-alias)

- TSconfig, among other things, can be used to help Visual Studio Code resolve aliased imports.

  - We pulled our typescript config from Vue's. (We excluded the webpack-env type though.)

- [Webpack vs. Webpack Dev Server vs. Webpack Hot Server vs. ...](https://stackoverflow.com/questions/42294827/webpack-vs-webpack-dev-server-vs-webpack-dev-middleware-vs-webpack-hot-middlewar)

- [Using Typescript with Vue via webpack](https://alexjover.com/blog/integrate-typescript-in-your-vue-project/)

  - [Reminder on using loaders with correct syntax](https://webpack.js.org/concepts/loaders/)

- [Using Typescript in Single File Components (SFC's)](https://alligator.io/vuejs/using-typescript-with-vue/)

- [Adding Hot Module Reloading](https://github.com/webpack-contrib/webpack-hot-middleware)

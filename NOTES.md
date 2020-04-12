- [Using babel to execute typescript](https://github.com/babel/babel/issues/6353)

- When using `extends` in `.eslintrc`, the ordering is important. Latter rules overwrite former rules.

- Using `plugin:@typescript-eslint/recommended` handled the issues of "not using interfaces" even though we were.

- [ESLint with Typescript imports](https://github.com/alexgorbatchev/eslint-import-resolver-typescript)
  - After a series of annoying Googles and searches for how to resolve "eslint import issues with typescript", we finally found `.eslintrc` configuration that worked. There may be extraneous typescript configurations. It's hard to tell because some configurations are needed for basic typescript linting. But at this point, we'll keep everything that's present. The import/extension rules and the import/resolver settings are definitely required. The others may just be related to proper typescript linting.

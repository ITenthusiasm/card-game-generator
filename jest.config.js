module.exports = {
  collectCoverageFrom: ["<rootDir>/{src,server}/**/!(*.test.ts)"],
  coverageDirectory: "<rootDir>/coverage", // default
  coverageThreshold: {
    global: {
      statements: 90,
      branches: 90,
      functions: 90,
      lines: 90,
    },
  },
  projects: ["test-utils/jest.server.js"],
  watchPlugins: [
    "jest-watch-select-projects",
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname",
  ],
};

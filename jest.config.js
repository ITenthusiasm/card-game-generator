module.exports = {
  collectCoverageFrom: [
    "<rootDir>/{src,server}/**/*.{ts,vue}",
    "!<rootDir>/{src,server}/**/*.test.ts",
    "!<rootDir>/src/main.ts",
    "!<rootDir>/server/index.ts",
  ],
  coverageDirectory: "<rootDir>/coverage", // default
  coverageThreshold: {
    global: {
      statements: 90,
      branches: 90,
      functions: 90,
      lines: 90,
    },
  },
  projects: ["test-utils/jest.server.js", "test-utils/jest.client.js"],
  watchPlugins: [
    "jest-watch-select-projects",
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname",
  ],
};

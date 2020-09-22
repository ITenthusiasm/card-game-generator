const path = require("path");

module.exports = {
  rootDir: path.join(__dirname, ".."),
  collectCoverageFrom: ["<rootDir>/server/**/*.ts"],
  coverageDirectory: "<rootDir>/coverage/server",
  displayName: "server",
  testEnvironment: "jest-environment-node",
  testMatch: ["<rootDir>/server/**/__tests__/*.test.ts"],
};

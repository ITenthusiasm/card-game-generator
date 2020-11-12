const path = require("path");

module.exports = {
  rootDir: path.join(__dirname, ".."),
  collectCoverageFrom: [
    "<rootDir>/src/**/*.{ts,vue}",
    "!<rootDir>/src/**/*.test.ts",
    "!<rootDir>/src/main.ts",
  ],
  coverageDirectory: "<rootDir>/coverage/src",
  displayName: "client",
  moduleFileExtensions: ["ts", "vue", "js"], // "js" is required by Jest for some reason
  testEnvironment: "jest-environment-jsdom", // default
  testMatch: ["<rootDir>/src/**/*.test.ts"],
  transform: { "\\.vue$": "vue-jest", "\\.ts$": "babel-jest" },
};

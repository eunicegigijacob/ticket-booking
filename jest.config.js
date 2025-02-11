/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/prisma/setupTests.js"],
  testTimeout: 30000,
  moduleFileExtensions: ["js"],
  testMatch: [
    "<rootDir>/__tests__/unit/**/*.test.js",
    // "<rootDir>/__tests__/integration/**/*.test.js",
    // "<rootDir>/__tests__/e2e/**/*.test.js",
  ],
};

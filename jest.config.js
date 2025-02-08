/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/prisma/setupTests.js"], 
  testTimeout: 30000, 
  moduleFileExtensions: ["js"],
};

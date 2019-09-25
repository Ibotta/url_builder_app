module.exports = {
  verbose: true,
  testURL: 'http://localhost/',
  collectCoverage: true,
  globals: {
    ZAFClient: {
      init: () => {}
    }
  },
  coveragePathIgnorePatterns: [
    '<rootDir>/spec'
  ],
  setupTestFrameworkScriptFile: "<rootDir>setupTests.js",
  roots: ['./spec']
}

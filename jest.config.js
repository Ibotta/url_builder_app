export default {
  verbose: true,
  testEnvironmentOptions: {
    url: 'http://localhost/'
  },
  testEnvironment: 'jsdom',
  collectCoverage: true,
  globals: {
    ZAFClient: {
      init: () => {}
    }
  },
  coveragePathIgnorePatterns: [
    '<rootDir>/spec'
  ],
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
  roots: ['./spec']
}

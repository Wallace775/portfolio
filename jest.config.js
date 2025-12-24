module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: [
    '**/*.js',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!server.js'
  ],
  coverageReporters: ['text', 'lcov', 'html'],
  testTimeout: 10000
};
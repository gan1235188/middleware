module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePaths: [
    './'
  ],
  testMatch: ["**/test/**/*.test.ts"],
  transformIgnorePatterns: ['node_modules', 'dist']
};
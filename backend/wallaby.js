module.exports = function(wallaby) {
  return {
    files: [
      'src/**/*.ts',
      '!src/**/*.spec.ts',
      'prisma/**/*.ts',
      'tsconfig.json'
    ],
    tests: [
      'src/**/*.spec.ts',
      'test/**/*.ts'
    ],
    env: {
      type: 'node',
      runner: 'node'
    },
    testFramework: 'jest',
    compilers: {
      '**/*.ts': wallaby.compilers.typeScript({ 
        module: 'commonjs',
        target: 'ES2020'
      })
    },
    setup: function(wallaby) {
      const jestConfig = require('./jest.config.js');
      wallaby.testFramework.configure(jestConfig);
    },
    debug: true,
    trace: true,
    maxConsoleCallspersistenceSize: 100
  };
};

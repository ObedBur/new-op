module.exports = function(wallaby) {
  return {
    files: [
      'src/**/*.ts',
      'src/**/*.tsx',
      '!src/**/*.spec.ts',
      '!src/**/*.spec.tsx',
      'tsconfig.json'
    ],
    tests: [
      'src/**/*.spec.ts',
      'src/**/*.spec.tsx'
    ],
    env: {
      type: 'node',
      runner: 'node'
    },
    testFramework: 'jest',
    compilers: {
      '**/*.ts': wallaby.compilers.typeScript({ 
        module: 'commonjs',
        target: 'ES2020',
        jsx: 'react'
      }),
      '**/*.tsx': wallaby.compilers.typeScript({ 
        module: 'commonjs',
        target: 'ES2020',
        jsx: 'react'
      })
    },
    setup: function(wallaby) {
      const jestConfig = require('./jest.config.js');
      wallaby.testFramework.configure(jestConfig);
    },
    debug: true,
    trace: true,
    maxConsoleCallPersistenceSize: 100
  };
};

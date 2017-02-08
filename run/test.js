const karma = require('karma');

const PORT = 9876;

const config = {
  basepath: '..',
  files: [
    'index.js',
    'tests/**/*.js',
  ],
  port: PORT,
  frameworks: ['jasmine', 'commonjs'],
  browsers: ['PhantomJS'],
  preprocessors: {
    '**/*.js': ['commonjs'],
    'tests/**/*.js': ['coverage'],
  },
  reporters: [
    'progress',
    'coverage',
  ],
  // singleRun: true,
  // autoWatch: false,
  coverageReporter: {
    type: 'in-memory',
  },
  phantomjsLauncher: {
    exitOnResourceError: true,
  },
};

const exitHandler = exitCode => {
  console.log(`Karma has exited with ${exitCode}`);
  process.exit(exitCode);
};

const server = new karma.Server(config, exitHandler);

server.on('coverage_complete', (browser, coverageReport) => {
  console.log('Coverage report: ', coverageReport);
});

server.start();
// karma.runner.run({port: PORT});
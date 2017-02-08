const karma = require('karma');

const PORT = 9876;

const config = {
  basepath: '..',
  files: [
    'tests/**/*.js',
  ],
  port: PORT,
  frameworks: [
    'browserify',
    'jasmine',
  ],
  browsers: ['PhantomJS'],
  client: {
    captureConsole: true,
  },
  preprocessors: {
    'tests/**/*.js': ['browserify', 'coverage'],
  },
  reporters: [
    'progress',
    'coverage',
  ],
  singleRun: true,
  autoWatch: false,
  browserify: {
    debug: true,
  },
  coverageReporter: {
    type: 'text',
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
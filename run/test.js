const karma = require('karma');
const istanbul = require('browserify-istanbul');

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
    'tests/**/*.js': ['browserify'],
  },
  reporters: [
    'progress',
    'coverage',
  ],
  singleRun: true,
  autoWatch: false,
  browserify: {
    debug: true,
    browserField: false,  // don't grab the UMD build
    transform: [
      istanbul({
        ignore: ['**/tests/**'],
        defaultIgnore: false,
      }),
    ],
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
server.start();
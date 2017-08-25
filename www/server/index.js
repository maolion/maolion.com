const chalk = require('chalk');
const moment = require('moment');

const { inject } = require('./app/core');

const {
  Config,
  LoggerColorsToken,
  LoggerWriterToken,
  Logger,
} = require('./app/services');

const MainApplication = require('./app/app').default;

const config = require('./config')

inject(Config, config);

inject(LoggerColorsToken, !process.argv.includes('--disable-colors'));

inject(LoggerWriterToken, {
  write(data) {
    process.stdout.write(`${data}\n`);
  },
  error(reason) {
    process.stderr.write(`${reason}\n`);
  },
});

new MainApplication();

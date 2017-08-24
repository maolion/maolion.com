const chalk = require('chalk');
const moment = require('moment');
const { inject } = require('./app/core');
const { Config, Logger } = require('./app/services');

const MainApplication = require('./app/app').default;

const config = require('./config')

inject(Config, config);

inject(Logger, {
  info: console.info,
  debug: (...args) => {
    console.log(
      chalk.bold(chalk.cyan('[DEBUG]')),
      chalk.gray(`[${moment().format(config.dateTimeFormat)}]`),
      args.join(' '),
    );
  },
  error: (...args) => {
    console.error(
      chalk.bold(chalk.red('[ERROR]')),
      chalk.gray(`[${moment().format(config.dateTimeFormat)}]`),
      args.join(' '),
    );
  },
  warn: (...args) => {
    console.warn(
      chalk.bold(chalk.yellow('[WARN]')),
      chalk.gray(`[${moment().format(config.dateTimeFormat)}]`),
      args.join(' '),
    );
  },
  event: (...args) => {
    console.log(
      chalk.bold(chalk.green('[EVENT]')),
      chalk.gray(`[${moment().format(config.dateTimeFormat)}]`),
      args.join(' '),
    );
  },
});

new MainApplication();

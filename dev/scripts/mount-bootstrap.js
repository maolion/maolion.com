const Path = require('path');

const { CLIENT_SOURCE_DIR, WWW_PUBLIC_APP_DIR } = require('../constants');

const project = process.argv[process.argv.indexOf('--project') + 1];
const entryHTML = process.argv[process.argv.indexOf('--entry-html') + 1];
const isProd = process.argv.indexOf('--prod') > -1;


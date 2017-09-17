const Path = require('path');

const { CLIENT_SOURCE_DIR, WWW_PUBLIC_APP_DIR } = require('../constants');

const IS_PROD = process.argv.indexOf('--prod') > -1;

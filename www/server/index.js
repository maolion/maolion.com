var inject = require('./app/core').inject;
var Config = require('./app/services').Config;
var MainApplication = require('./app/app').default;

inject(Config, require('./config'));

new MainApplication();

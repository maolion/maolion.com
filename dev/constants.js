const Path = require('path');

const ROOT               = exports.ROOT               = Path.join(__dirname, '../');
const SOURCE_DIR         = exports.SOURCE_DIR         = Path.join(ROOT, 'src');
const CLIENT_SOURCE_DIR  = exports.CLIENT_SOURCE_DIR  = Path.join(SOURCE_DIR, 'client');
const SHARED_SOURCE_DIR  = exports.SHARED_SOURCE_DIR  = Path.join(SOURCE_DIR, 'shared');
const SERVER_SOURCE_DIR  = exports.SERVER_SOURCE_DIR  = Path.join(SOURCE_DIR, 'server');
const WWW_DIR            = exports.WWW_DIR            = Path.join(ROOT, 'www');
const WWW_PUBLIC_DIR     = exports.WWW_PUBLIC_DIR     = Path.join(WWW_DIR, 'public');
const WWW_SERVER_DIR     = exports.WWW_SERVER_DIR     = Path.join(WWW_DIR, 'server');
const WWW_PUBLIC_APP_DIR = exports.WWW_PUBLIC_APP_DIR = Path.join(WWW_PUBLIC_DIR, 'app');

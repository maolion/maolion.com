import * as Path from 'path';

export const PROJECT_DIR = Path.resolve(__dirname, '../../../');
export const SERVER_SOURCE_DIR = Path.join(PROJECT_DIR, 'src', 'server');
export const CLIENT_SOURCE_DIR = Path.join(PROJECT_DIR, 'src', 'client');
export const WWW_DIR = Path.join(PROJECT_DIR, 'www');
export const WWW_META_DIR = Path.join(WWW_DIR, 'meta');
export const WWW_SERVER_DIR = Path.join(WWW_DIR, 'server');
export const WWW_SERVER_APP_DIR = Path.join(WWW_SERVER_DIR, 'app');
export const WWW_PUBLIC_DIR = Path.join(WWW_DIR, 'public');
export const WWW_CLIENT_APP_DIR = Path.join(WWW_PUBLIC_DIR, 'app');

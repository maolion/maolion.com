import * as Path from 'path';

export const PROJECT_DIR = Path.resolve(__dirname, '../../../');
export const WWW_DIR = Path.join(PROJECT_DIR, 'www');
export const WWW_PUBLIC_DIR = Path.join(WWW_DIR, 'public');
export const WWW_SERVER_DIR = Path.join(WWW_DIR, 'server');
export const WWW_SERVER_META_DIR = Path.join(WWW_SERVER_DIR, 'meta');

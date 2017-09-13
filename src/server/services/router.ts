import * as Path from 'path';
import { Router as VIORouter } from 'vio';

import { Injectable } from '../modules/core';

import { Config } from './config';
import { HttpServer } from './http-server';
import { Logger } from './logger';

import { WWW_CLIENT_APP_DIR, WWW_SERVER_APP_DIR } from '../constants';

@Injectable()
export class Router extends VIORouter {
  constructor(
    config: Config,
    logger: Logger,
    httpServer: HttpServer,
  ) {
    super(httpServer.expressApplication, {
      defaultSubsite: 'app',
      routesRoot: Path.join(WWW_SERVER_APP_DIR, 'routes'),
      viewsRoot: Path.join(WWW_CLIENT_APP_DIR),
      production: config.env === 'production',
    });
  }
}

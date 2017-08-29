import * as Path from 'path';
import { Router as VIORouter } from 'vio';

import { Injectable } from '../core';

import { HttpServer } from './http-server';
import { Logger } from './logger';

import { WWW_SERVER_APP_DIR } from '../constants';

@Injectable()
export class Router extends VIORouter {
  constructor(
    logger: Logger,
    httpServer: HttpServer,
  ) {
    super(httpServer.expressApplication, {
      defaultSubsite: 'app',
      routesRoot: Path.join(WWW_SERVER_APP_DIR, 'routes'),
    });
  }
}

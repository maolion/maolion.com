import * as Path from 'path';
import { Router as VIORouter } from 'vio';

import { Injectable } from '../core';

import { HttpServer } from './http-server';

import { WWW_SERVER_APP_DIR } from '../constants';

@Injectable()
export class Router extends VIORouter {
  constructor(
    httpServer: HttpServer,
  ) {
    super(httpServer.expressApplication, {
      routesRoot: Path.join(WWW_SERVER_APP_DIR, 'routes'),
    });
  }
}

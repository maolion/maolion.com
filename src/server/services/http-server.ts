import { Server, createServer } from 'http';
import * as Path from 'path';

import * as express from 'express';
import { Router } from 'vio';

import { Injectable } from '../core';

import { Config } from './config';
import { Logger } from './logger';

import { WWW_SERVER_APP_DIR } from '../constants';

@Injectable()
export class HttpServer {
  server: Server;
  expressApplication: express.Express;
  router: Router;

  constructor(
    private logger: Logger,
    private config: Config,
  ) {
    this.createExpressApplication();
    this.createServer();
    this.createRouter();
  }

  start(): void {
    let {logger, config, server} = this;

    server.listen(config.port, () => {
      logger.event(`Http server is listening on ${config.host}:${config.port}`);
    });
  }

  private createExpressApplication(): void {
    this.expressApplication = express();
  }

  private createServer(): void {
    this.server = createServer(this.expressApplication);
  }

  private createRouter(): void {
    let {expressApplication} = this;

    this.router = new Router(expressApplication, {
      routesRoot: Path.join(WWW_SERVER_APP_DIR, 'routes'),
    });
  }
}

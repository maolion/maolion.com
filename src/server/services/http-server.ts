import { Server, createServer } from 'http';

import * as express from 'express';

import { Injectable } from '../core';

import { Config } from './config';
import { Logger } from './logger';

@Injectable()
export class HttpServer {
  server: Server;
  expressApp: express.Express;

  constructor(
    private logger: Logger,
    private config: Config,
  ) {
    this.expressApp = express();
    this.server = createServer(this.expressApp);
  }

  start(): void {
    let {logger, config, server} = this;

    server.listen(config.port, () => {
      logger.event(`Http server is listening on ${config.host}:${config.port}`);
    });
  }
}

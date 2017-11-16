import {
  json as jsonBodyParser,
  urlencoded as urlencodedBodyParser,
} from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import {Server, createServer} from 'http';
import * as Path from 'path';

import {Injectable} from '../modules/core';

import {Config} from './config';
import {Logger} from './logger';
import {TemplateEngine} from './template-engine';

import {WWW_CLIENT_APP_DIR} from '../constants';

@Injectable()
export class HttpServer {
  server: Server;
  expressApplication: express.Express;

  constructor(
    private logger: Logger,
    private config: Config,
    private templateEngine: TemplateEngine,
  ) {
    this.createExpressApplication();
    this.createServer();
  }

  start(): void {
    let {logger, config, server} = this;

    server.listen(config.port, () => {
      logger.event(`Http server is listening on ${config.host}:${config.port}`);
    });
  }

  private createExpressApplication(): void {
    let app = (this.expressApplication = express());

    app.use(jsonBodyParser());
    app.use(urlencodedBodyParser({extended: true}));

    app.use(
      cors({
        credentials: true,
        // tslint:disable-next-line:no-null-keyword
        origin: (origin, callback) => callback(null, true),
      }),
    );

    app.disable('x-powered-by');

    app.use(
      '/app',
      express.static(Path.join(WWW_CLIENT_APP_DIR), {index: false}),
    );

    app.engine('html', this.templateEngine.render);
  }

  private createServer(): void {
    this.server = createServer(this.expressApplication);
  }
}

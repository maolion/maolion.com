import 'source-map-support/register';
import { App } from './core';

import { Config, HttpServer, Logger, Welcome } from './services';

@App()
export default class MainApplication {
  constructor(
    public config: Config,
    public httpServer: HttpServer,
    public logger: Logger,
    welcome: Welcome,
  ) {
    welcome.to();
    httpServer.start();
  }
}

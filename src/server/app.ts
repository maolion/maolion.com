import { App } from './core';

import { Config, HttpServer, Welcome } from './services';

@App()
export default class MainApplication {
  constructor(
    public config: Config,
    welcome: Welcome,
    httpServer: HttpServer,
  ) {
    welcome.to();
    httpServer.start();
  }
}

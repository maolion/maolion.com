import { App } from './modules/core';

import {
  Config,
  HttpServer,
  Logger,
  Router,
  Welcome,
} from './services';

@App()
export default class MainApplication {
  constructor(
    public config: Config,
    public httpServer: HttpServer,
    public router: Router,
    public logger: Logger,
    welcome: Welcome,
  ) {
    welcome.to();
    httpServer.start();
  }
}

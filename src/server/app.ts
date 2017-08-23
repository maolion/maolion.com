import { App } from './core';

import { Config } from './services';

@App()
export default class MainApplication {
  constructor(
    config: Config,
  ) {
    console.log(config.host);
  }
}

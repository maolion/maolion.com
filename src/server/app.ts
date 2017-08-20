import { App } from './core';

import { Config } from './services/';

@App()
export class MainApplication {
  constructor(
    config: Config,
  ) { }
}

import * as chalk from 'chalk';
import * as FS from 'fs';
import * as Path from 'path';

import { Injectable } from '../core';

import { Logger } from './logger';

import { WWW_SERVER_META_DIR } from '../constants';

@Injectable()
export class Welcome {
  constructor(
    private logger: Logger,
  ) { }

  to() {
    this.printLogo();
    this.logger.event('Hello, world');
  }

  private printLogo(): void {
    let {logger} = this;
    const logoData = FS.readFileSync(Path.join(WWW_SERVER_META_DIR, 'logo.txt'), 'utf8');

    if (logger.enableLoggerColors) {
      const chalkLogoData = logoData
        .replace('maolion.com', 'maolion!com')
        .replace(/[\.]/g, match => chalk.gray(match))
        .replace('maolion!com', chalk.yellow('maolion.com'))
        .replace(/\/+/g, match => chalk.green(match))
        .replace(/\\/g, match => chalk.yellow(match));

      logger.log(chalkLogoData);
    } else {
      logger.log(logoData);
    }
  }
}

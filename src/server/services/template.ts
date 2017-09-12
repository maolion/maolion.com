import * as FS from 'fs';
import { Injectable } from '../modules/core';

import { Logger } from './logger';

@Injectable()
export class Template {
  constructor(
    logger: Logger,
  ) { }

  readFile(filePath: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      FS.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(data);
      });
    });
  }
}

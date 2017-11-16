import {handlebars} from 'consolidate';

import {Injectable} from '../modules/core';
import {Logger} from './logger';

export interface RenderOptions {
  cache?: boolean;
  [otherOptions: string]: any;
}

@Injectable()
export class TemplateEngine {
  constructor(protected logger: Logger) {
    this.render = this.render.bind(this);
  }

  render(
    path: string,
    options: RenderOptions,
    callback: (err: Error, html: string) => any,
  ): any {
    return handlebars(path, options, callback);
  }
}

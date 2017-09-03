import * as Path from 'path';
import {
  Controller,
  get,
} from 'vio';

import { Routes, getInjection } from '../../modules/core';
import { Logger } from '../../services/logger';

import { WWW_CLIENT_APP_DIR } from '../../constants';

const MAIN_PAGE_PATH = Path.join(WWW_CLIENT_APP_DIR, 'index.html');

const logger = getInjection(Logger);

logger.log(WWW_CLIENT_APP_DIR, '<<<<<<');

@Routes()
export default class extends Controller {
  @get({
    view: MAIN_PAGE_PATH,
  })
  @get({
    path: '*',
    view: 'index.html',
  })
  default() {
    return {};
  }
}

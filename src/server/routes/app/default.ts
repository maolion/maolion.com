import * as Path from 'path';
import {
  Controller,
  get,
} from 'vio';

import { Routes } from '../../core';

import { WWW_CLIENT_APP_DIR } from '../../constants';
const MAIN_PAGE_PATH = Path.join(WWW_CLIENT_APP_DIR, 'index.html');

@Routes()
export default class extends Controller {
  @get({
    view: MAIN_PAGE_PATH,
  })
  @get({
    path: '*',
    view: MAIN_PAGE_PATH,
  })
  default() {
    return {};
  }
}

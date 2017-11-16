import * as Path from 'path';
import {Controller, get} from 'vio';

import {Routes} from '../../modules/core';

import {WWW_CLIENT_APP_DIR} from '../../constants';

const MAIN_PAGE_PATH = Path.join(WWW_CLIENT_APP_DIR, 'index.html');

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
    return {a: 10, b: 20};
  }
}

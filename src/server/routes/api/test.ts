import {
  Controller,
  ExpressRequest,
  get,
} from 'vio';

import { Routes } from '../../core';

@Routes()
export default class extends Controller {
  @get()
  default(req: ExpressRequest) {
    return {
      data: 'hello,world',
    };
  }
}

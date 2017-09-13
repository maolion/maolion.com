import { Injectable } from '../modules/core';

export type EnvironmentType = 'debug' | 'production';
@Injectable()
export class Config {
  env: EnvironmentType = 'debug';

  host = 'localhost';
  port = '80';

  dateTimeFormat = 'YYYY/MM/DD HH:ii:ss';
  dateFormat = 'YYYY/MM/DD';
  timeFormat = 'HH:ii:ss';
}

import { Injectable } from '../modules/core';

@Injectable()
export class Config {
  host = 'localhost';
  port = '80';

  dateTimeFormat = 'YYYY/MM/DD HH:ii:ss';
  dateFormat = 'YYYY/MM/DD';
  timeFormat = 'HH:ii:ss';
}

import { Injectable } from '../core';

export type LogHandler = (...message: string[]) => void;
@Injectable()
export class Logger {
  info: LogHandler;
  debug: LogHandler;
  warn: LogHandler;
  error: LogHandler;
  event: LogHandler;
}

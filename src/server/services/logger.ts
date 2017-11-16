import * as chalk from 'chalk';
import * as moment from 'moment';

import {Inject, Injectable, InjectionToken} from '../modules/core';

import {Config} from './config';

export type LogHandler = (...message: string[]) => void;

export const LoggerColorsToken = new InjectionToken('logger-colors');
export const LoggerWriterToken = new InjectionToken('logger-writer');

export interface LoggerWriter {
  write(data: string): void;
  error(reason: string): void;
}

export type LoggerLabel = 'EVENT' | 'WARN' | 'ERROR' | 'INFO' | 'DEBUG';

const debugWriter = console.debug;

@Injectable()
export class Logger {
  private chalk: chalk.Chalk;

  constructor(
    @Inject(LoggerWriterToken) public loggerWriter: LoggerWriter,
    @Inject(LoggerColorsToken) public enableLoggerColors: boolean,
    private config: Config,
  ) {
    console.info = console.log = this.info.bind(this);
    console.error = this.error.bind(this);
    console.warn = this.warn.bind(this);
    console.debug = this.debug.bind(this);

    this.chalk = new chalk.constructor({enabled: this.enableLoggerColors});
  }

  log(...args: any[]): void {
    this.loggerWriter.write(args.map(toString).join(' '));
  }

  debug(message: any, ...optionalParams: any[]): void {
    debugWriter(
      `${this.wrapLabel('DEBUG')} ${this.date()} ${this.process(message)}`,
      ...optionalParams,
    );
  }

  info(...args: any[]): void {
    this.loggerWriter.write(
      `${this.wrapLabel('INFO')} ${this.date()} ${this.process(
        args.map(toString).join(' '),
      )}`,
    );
  }

  event(...args: any[]): void {
    this.loggerWriter.write(
      `${this.wrapLabel('EVENT')} ${this.date()} ${this.process(
        args.map(toString).join(' '),
      )}`,
    );
  }

  warn(...args: any[]): void {
    let data = this.chalk.yellow(args.map(toString).join(' '));

    this.loggerWriter.write(
      `${this.wrapLabel('WARN')} ${this.date()} ${this.process(data)}`,
    );
  }

  error(...reason: any[]): void {
    let message = reason.map(toString).join(' ');

    if (this.enableLoggerColors) {
      message = chalk.red(message);
    }

    this.loggerWriter.write(
      `${this.wrapLabel('ERROR')} ${this.date()} ${this.process(message)}`,
    );
  }

  private wrapLabel(label: LoggerLabel): string {
    let {chalk} = this;

    switch (label) {
      case 'INFO':
        return chalk.bold.cyan(` ${label}`);
      case 'ERROR':
        return chalk.bold.red(label);
      case 'WARN':
        return chalk.bold.yellow(` ${label}`);
      case 'EVENT':
        return chalk.bold.green(label);
      case 'DEBUG':
        return chalk.bold.gray(label);
    }

    return label;
  }

  private date(): string {
    let {config: {dateTimeFormat, env}, chalk} = this;

    if (env !== 'production') {
      return '';
    }

    let date = moment().format(dateTimeFormat);

    return chalk.gray(`[${date}]`);
  }

  private process(content: string): string {
    return content;
  }
}

function toString(object: any): string {
  if ((object || typeof object !== 'undefined') && typeof object !== 'object') {
    return object.toString();
  } else if (object instanceof Function) {
    return object.toString();
  } else if (object instanceof Error) {
    return object.stack || object.message;
  } else if (object) {
    return JSON.stringify(object);
  } else if (object === undefined) {
    return 'undefined';
  } else if (object === null) {
    return 'null';
  }

  return object;
}

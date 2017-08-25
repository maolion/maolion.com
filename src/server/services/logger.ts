import * as chalk from 'chalk';
import * as moment from 'moment';

import { Inject, Injectable, InjectionToken } from '../core';

import { Config } from './config';

export type LogHandler = (...message: string[]) => void;

export const LoggerColorsToken = new InjectionToken('logger-colors');
export const LoggerWriterToken = new InjectionToken('logger-writer');

export interface LoggerWriter {
  write(data: string): void;
  error(reason: string): void;
}

export type LoggerLabel = 'EVENT' | 'WARN' | 'ERROR' | 'DEBUG';

@Injectable()
export class Logger {
  constructor(
    @Inject(LoggerWriterToken)
    public loggerWriter: LoggerWriter,

    @Inject(LoggerColorsToken)
    public enableLoggerColors: boolean,

    private config: Config,
  ) { }

  log(...args: string[]): void {
    this.loggerWriter.write(args.join(' '));
  }

  debug(...args: string[]): void {
    this.loggerWriter.write(
      `${this.wrapLabel('DEBUG')} ${this.date()} ${args.join(' ')}`,
    );
  }

  event(...args: string[]): void {
    this.loggerWriter.write(
      `${this.wrapLabel('EVENT')} ${this.date()} ${args.join(' ')}`,
    );
  }

  warn(...args: string[]): void {
    this.loggerWriter.write(
      `${this.wrapLabel('WARN')} ${this.date()} ${args.join(' ')}`,
    );
  }

  error(...args: string[]): void {
    this.loggerWriter.write(
      `${this.wrapLabel('ERROR')} ${this.date()} ${args.join(' ')}`,
    );
  }

  private wrapLabel(label: LoggerLabel): string {
    if (this.enableLoggerColors) {
      return this.wrapLabelWithColors(label);
    } else {
      return `[${label}]`;
    }
  }

  private wrapLabelWithColors(label: LoggerLabel): string {
    switch (label) {
      case 'DEBUG':
        return chalk.bold.cyan(`[${label}]`);
      case 'ERROR':
        return chalk.bold.red(`[${label}]`);
      case 'WARN':
        return chalk.bold.yellow(`[${label}]`);
      case 'EVENT':
        return chalk.bold.green(`[${label}]`);
    }

    return label;
  }

  private date(): string {
    let {config: {dateTimeFormat}, enableLoggerColors} = this;

    let date = moment().format(dateTimeFormat);

    if (enableLoggerColors) {
      return chalk.gray(`[${date}]`);
    } else {
      return `[${date}]`;
    }
  }
}

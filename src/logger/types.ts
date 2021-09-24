export interface ILoggerService {
  log(...args: any[]): void;

  warn(...args: any[]): void;

  error(...args: any[]): void;

  debug(...args: any[]): void;
}

export enum ELogLevel {
  EMERG = 'emerg',
  ALERT = 'alert',
  CRIT = 'crit',
  ERROR = 'error',
  WARNING = 'warning',
  NOTICE = 'notice',
  INFO = 'info',
  DEBUG = 'debug'
}

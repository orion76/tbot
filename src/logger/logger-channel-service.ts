import { ELogLevel, ILoggerService } from './types';
import { createLogger, format, Logger, transports } from 'winston';


export const APP_LOGGER='APP_LOGGER';

export class LoggerChannelService implements ILoggerService {

  _logger: Logger;
  private channel = 'tbot';
  private level = ELogLevel.DEBUG;

  constructor() {

    this._logger = createLogger({
      level: this.level,
      format: format.simple(),
      transports: [
        new transports.File({filename: `./logs/${this.channel}.error.log`, level: 'error'}),
        new transports.File({filename: `./logs/${this.channel}.log`}),
        new transports.Console({}),
      ],
    })
  }

  log(...args: any[]) {
    return this._log(ELogLevel.INFO, args);
  }

  warn(...args: any[]) {
    return this._log(ELogLevel.WARNING, args);
  }


  error(...args: any[]) {
    return this._log(ELogLevel.ERROR, args);
  }


  debug(...args: any[]) {
    return this._log(ELogLevel.DEBUG, args);
  }

  _log(level: ELogLevel, args: any[]) {
    this._logger.log(level, JSON.stringify(args, null, 2));
  }


}

import { Inject, Injectable } from '@nestjs/common';
import { IControlService } from '../types';
import { APP_LOGGER } from '../../logger/logger-channel-service';
import { ILoggerService } from '../../logger/types';
import { IAppConfigFlood } from '../services.module';
import { appConfig } from '../../app.module';


export const CONTROL_SERVICE = 'CONTROL_SERVICE';

@Injectable()
export class ControlService implements IControlService {
  lastUpdate = 0;
  floodCount = 0;
  private config: IAppConfigFlood = appConfig.flood;

  constructor(
    @Inject(APP_LOGGER) private logger: ILoggerService,
  ) {

  }

  isGoneCrazy() {
    const {minPeriod, floodCountAvailable} = this.config;
    const now = Date.now();
    if (this.lastUpdate === 0) {
      this.lastUpdate = now;
      return;
    }
    const period = now - this.lastUpdate;

    if (period < minPeriod) {
      this.floodCount++;
      if (this.floodCount > floodCountAvailable) {
        this.logger.error(`Bot is flooder. count:${this.floodCount}`);
        process.exit();
      }
    } else {
      this.floodCount = 0;
      this.lastUpdate = now;
    }
  }


}

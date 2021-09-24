import { Module } from '@nestjs/common';
import { APP_LOGGER, LoggerChannelService } from './logger-channel-service';


@Module({
  imports: [],
  providers: [{provide: APP_LOGGER, useClass: LoggerChannelService}],
  exports: [APP_LOGGER, {provide: APP_LOGGER, useClass: LoggerChannelService}]
})
export class LoggerModule {

}

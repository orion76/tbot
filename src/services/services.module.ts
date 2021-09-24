import { Module } from '@nestjs/common';
import { MESSAGE_SERVICE, MessageService } from './message.service';
import { DatabaseModule } from '../database/database.module';
import { TELEGRAM_SERVICE, TelegramService } from './telegram.service';
import { CONTROL_SERVICE, ControlService } from './control.service';
import { LoggerModule } from '../logger/logger.module';


export interface IAppConfigFlood {
  minPeriod: number;
  floodCountAvailable: number;
}

@Module({
  imports: [
    DatabaseModule, LoggerModule
  ],
  providers: [
    {provide: TELEGRAM_SERVICE, useClass: TelegramService},
    {provide: MESSAGE_SERVICE, useClass: MessageService},
    {provide: CONTROL_SERVICE, useClass: ControlService},
  ],
  exports: [
    {provide: MESSAGE_SERVICE, useClass: MessageService},
    {provide: CONTROL_SERVICE, useClass: ControlService},
  ],
})
export class ServicesModule {
}

import { Module } from '@nestjs/common';
import { LoggerModule } from '../../logger/logger.module';
import { MESSAGE_SERVICE, MessageService } from './message.service';
import { DatabaseModule } from '../../database/database.module';
import { ControlModule } from '../control/control.module';

@Module({
  imports: [
    ControlModule,
    LoggerModule,
    DatabaseModule
  ],
  providers: [
    {provide: MESSAGE_SERVICE, useClass: MessageService},
  ],
  exports: [
    {provide: MESSAGE_SERVICE, useClass: MessageService},

  ],
})
export class MessageModule {
}

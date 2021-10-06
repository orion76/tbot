import { Module } from '@nestjs/common';
import { MESSAGE_SERVICE, MessageService } from './message/message.service';
import { LoggerModule } from '../logger/logger.module';
import { DatabaseModule } from '../database/database.module';


export interface IAppConfigFlood {
  minPeriod: number;
  floodCountAvailable: number;
}


@Module({
  imports: [
    DatabaseModule, 
    LoggerModule,
    // TypeOrmModule.forFeature([TgMessage,TgUser],'default'),
    
  ],
  providers: [
    {provide: MESSAGE_SERVICE, useClass: MessageService},
  ],
  exports: [
    {provide: MESSAGE_SERVICE, useClass: MessageService},

  ],
})
export class ServicesModule {
}

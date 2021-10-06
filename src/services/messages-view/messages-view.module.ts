import { Module } from '@nestjs/common';
import { LoggerModule } from '../../logger/logger.module';

import { DatabaseModule } from '../../database/database.module';
import { MESSAGES_VIEW_SERVICE, MessagesViewService } from './messages-view.service';

@Module({
  imports: [
    DatabaseModule,
    LoggerModule,
  ],
  providers: [
    {provide: MESSAGES_VIEW_SERVICE, useClass: MessagesViewService},
  ],
  exports: [
    {provide: MESSAGES_VIEW_SERVICE, useClass: MessagesViewService},

  ],
})
export class MessagesViewModule {
}

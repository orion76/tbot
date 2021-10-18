import { Module } from '@nestjs/common';
import { ChanelPostUpdate } from './chanel-post.update';
import { LoggerModule } from '../logger/logger.module';
import { DatabaseModule } from '../database/database.module';
import { ControlModule } from '../services/control/control.module';
import { MessageModule } from '../services/message/message.module';
import { TagModule } from '../services/tag/tag.module';
import { AppConfigModule } from '../app-config.module';
import { MessagesViewModule } from '../services/messages-view/messages-view.module';


@Module({
  imports: [
    AppConfigModule,
    ControlModule,
    MessageModule,
    LoggerModule,
    DatabaseModule,
    TagModule,
    MessagesViewModule
  ],
  providers: [
    ChanelPostUpdate,
  ],
  exports: [
    ChanelPostUpdate,
  ]
})
export class ChanelPostModule {
}

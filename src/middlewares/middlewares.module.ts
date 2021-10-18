import { Module } from '@nestjs/common';
import { MessageSaveMiddleware } from './message-save.middleware';
import { DatabaseModule } from '../database/database.module';
import { ChanelPostModule } from '../chanel-post/chanel-post.module';
import { ControlModule } from '../services/control/control.module';
import { MessageModule } from '../services/message/message.module';
import { TagModule } from '../services/tag/tag.module';
import { SafeThreadHandler } from './save-thread.handler';
import { AppConfigModule } from '../app-config.module';
import { SafeTagHandler } from './save-tag.handler';

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    ControlModule,
    ChanelPostModule,
    MessageModule,
    TagModule,
  ],
  providers: [
    MessageSaveMiddleware,
    SafeThreadHandler,
    SafeTagHandler
  ],
  exports: [
    MessageSaveMiddleware,
    SafeThreadHandler,
    SafeTagHandler,
  ],
})
export class MiddlewaresModule {
 
}

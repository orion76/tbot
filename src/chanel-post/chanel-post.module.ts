import { Module } from '@nestjs/common';
import { ChanelPostUpdate } from './chanel-post.update';
import { COPY_TO_CHANNEL_SERVICE, CopyToChannelService } from './copy-to-channel.service';
import { ServicesModule } from '../services/services.module';
import { LoggerModule } from '../logger/logger.module';


@Module({
  imports: [ ServicesModule, LoggerModule],
  providers: [
    {provide: COPY_TO_CHANNEL_SERVICE, useClass: CopyToChannelService},
    ChanelPostUpdate,
  ],
  exports: [COPY_TO_CHANNEL_SERVICE, ChanelPostUpdate]
})
export class ChanelPostModule {
}

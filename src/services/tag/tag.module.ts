import { Module } from '@nestjs/common';
import { LoggerModule } from '../../logger/logger.module';
import { TAG_SERVICE, TagService } from './tag.service';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [
    DatabaseModule,
    LoggerModule,
  ],
  providers: [
    {provide: TAG_SERVICE, useClass: TagService},
  ],
  exports: [
    {provide: TAG_SERVICE, useClass: TagService},

  ],
})
export class TagModule {
}

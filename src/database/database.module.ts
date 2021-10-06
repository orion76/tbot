import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TgUserRepository } from './repositories/tg-user.repository';
import { TgMessageRepository } from './repositories/tg-message.repository';
import { TgChatRepository } from './repositories/tg-chat.repository';
import { TagRepository } from './repositories/tag.repository';
import { MessageTypeRepository } from './repositories/message-type.repository';


const repositories = [
  TgUserRepository,
  TgMessageRepository,
  TgChatRepository,
  TagRepository,
  MessageTypeRepository,
]


@Module({
  imports: [
    TypeOrmModule.forFeature(repositories)
  ],
  exports: [
    TypeOrmModule
  ],
  // repositories: repositories
})
export class DatabaseModule {
}

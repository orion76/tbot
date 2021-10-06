import { EntityRepository } from 'typeorm';
import { TgChat } from '../entities/tg-chat.entity';
import { BaseRepository } from './base.repository';
import { IEntityChat } from '../entities/types';

@EntityRepository(TgChat)
export class TgChatRepository extends BaseRepository<IEntityChat> {
}

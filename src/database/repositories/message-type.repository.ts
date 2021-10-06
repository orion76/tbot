import { EntityRepository } from 'typeorm';
import { MessageType } from '../entities/message-type.entity';
import { BaseRepository } from './base.repository';

@EntityRepository(MessageType)
export class MessageTypeRepository extends BaseRepository<MessageType> {

}

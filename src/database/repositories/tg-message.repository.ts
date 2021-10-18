import { EntityRepository, In, SelectQueryBuilder } from 'typeorm';
import { TgMessage } from '../entities/message/tg-message.entity';
import { BaseRepository } from './base.repository';
import { IEntityMessage } from '../entities/types';


@EntityRepository(TgMessage)
export class TgMessageRepository extends BaseRepository<IEntityMessage> {


  async findUserMessages(userId: number, start?: number, length?: number): Promise<IEntityMessage[]> {
    return this.find({
      where: {
        from: {id: userId}
      },
      relations: ['from', 'chat'],
      skip: start ? start : 0,
      take: length
    })
  }

  async findByTag(tag: string, chat_id: string, start?: number, length?: number): Promise<string[]> {
    return new Promise((resolve, reject) => {
      this.findByTagQuery(tag, chat_id, start, length).getRawMany().then((result) => {
        resolve(result.map((entity) => entity.entity_id));
      });
    })
  }

  async loadMultiple(ids: string[]):Promise<IEntityMessage[]> {
    return this.find({where: {id: In(ids)}});
  }


  findByTagQuery(tag: string, chat_id: string, start?: number, length?: number): SelectQueryBuilder<IEntityMessage> {
    return this.createQueryBuilder('entity')
      .select('entity.id')
      .leftJoin('tg_message_tags_tag', 'tags', 'tags.tgMessageId=entity.id')
      .leftJoinAndSelect('tag', 'tag', 'tags.tagId=tag.id')
      .where('tag.title=:tag', {tag}).offset(start).limit(length);
  }

  async findByTagCount(tag: string, chat_id: string, start?: number, length?: number): Promise<number> {
    return this.findByTagQuery(tag, chat_id, start, length).getCount();
  }

  loadByTelegramId(chatId: number, message_id: number): Promise<IEntityMessage> {
    const deleted = false;
    return this.findOne({
      where: {message_id, chatId: chatId, deleted},
      relations: ['message_ref', 'user_ref', 'chat_ref']
    })
  }


}

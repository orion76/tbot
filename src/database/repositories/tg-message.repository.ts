import { EntityRepository } from 'typeorm';
import { TgMessage } from '../entities/tg-message.entity';
import { MessageMap } from '../telegram-entity-map/message.map';
import { BaseRepository } from './base.repository';
import { IReference } from '../types';
import { TgChatRepository } from './tg-chat.repository';
import { TgUserRepository } from './tg-user.repository';
import { IEntityChat, IEntityMessage, IEntityUser } from '../entities/types';


@EntityRepository(TgMessage)
export class TgMessageRepository extends BaseRepository<IEntityMessage> {

  entity_map = new MessageMap();

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

  async findByTag(tag: string, chatName: string, start?: number, length?: number): Promise<IEntityMessage[]> {
    return this.find({
      where: {
        tags: {title: tag},
        chat: {username: chatName},
      },
      relations: ['from', 'chat'],
      skip: start ? start : 0,
      take: length
    })
  }


  loadByTelegramId(chatId: number, message_id: number): Promise<IEntityMessage> {
    const deleted = false;
    return this.findOne({
      where: {message_id, chatId: chatId, deleted},
      relations: ['message_ref', 'user_ref', 'chat_ref']
    })
  }


  async saveReferencesDeep(message: IEntityMessage): Promise<IEntityMessage | undefined> {
    let n = 0;
    const exist = await this.loadByTelegramId(message.chat.id, message.message_id);
    if (exist) {
      return exist;
    }
    const values = this.entity_map.getValues(message);
    const entity = this.create(values);

    const users = await this.saveUsers(message);
    const chats = await this.saveChats(message);
    const messages = await this.saveMessages(message);
    //
    //
    //
    // users.forEach((ref) => {
    //   entity.setReference('user', ref.type, this.createUserRef(ref.type, ref.entity));
    // });
    // chats.forEach((ref) => {
    //   entity.setReference('chat', ref.type, this.createChatRef(ref.type, ref.entity));
    // });
    // messages.forEach((ref) => {
    //   entity.setReference('message', ref.type, this.createMessageRef(ref.type, ref.entity))
    // });
    //
    // entity.chatId = entity.chat.id;
    //
    // await this.saveReferences(entity);
    //// const saved = await this.save(entity);
    // return entity;
    return;
  }

  async saveReferences(message: IEntityMessage) {
    // message.user_ref = [];
    // message.getUsers().forEach((users, type) => {
    //   users.forEach((user_ref) => {
    //     message.user_ref.push({type, target: user_ref, source: message})
    //   })
    // })

    // message.chat_ref = [];
    // message.getChats().forEach((chats, type) => {
    //   chats.forEach((chat_ref) => {
    //     message.chat_ref.push({type, target: chat_ref, source: message})
    //   })
    // })

    // message.message_ref = [];
    // message.getMessages().forEach((messages, type) => {
    //   messages.forEach((message_ref) => {
    //     message.message_ref.push({type, target: message_ref, source: message})
    //   })
    // })

  }

  async saveChats(message: IEntityMessage): Promise<IReference<IEntityChat>[]> {

    const references = this.entity_map.getReferences<IEntityChat>('chat', message);
    const repository = this.manager.getCustomRepository(TgChatRepository);
    const entities = references.map((ref) => ref.entity);
    const saved = await repository.saveMultiple(entities);

    return references.map((ref) => {
      ref.entity = saved.get(ref.entity.id);
      return ref;
    })
  }

  async saveUsers(message: IEntityMessage): Promise<IReference<IEntityUser>[]> {


    const references = this.entity_map.getReferences<IEntityUser>('user', message);

    const repository = this.manager.getCustomRepository(TgUserRepository);
    const entities = references.map((ref) => repository.create(ref.entity));
    const saved = await repository.saveMultiple(entities);
    return references.map((ref) => {
      ref.entity = saved.get(ref.entity.id);
      return ref;
    })
  }

  async saveMessages(message: IEntityMessage): Promise<IReference<IEntityMessage>[]> {

    const message_references = this.entity_map.getReferences<IEntityMessage>('message', message);
    const references: IReference<IEntityMessage>[] = [];

    for (const reference of message_references) {
      const entity = await this.saveReferencesDeep(reference.entity);
      await this.save(entity);
      references.push({type: reference.type, entity})
    }
    return references;
  }

}

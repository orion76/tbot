import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { IMessageService } from '../types';
import { InjectRepository } from '@nestjs/typeorm';
import { TgUserRepository } from '../../database/repositories/tg-user.repository';
import { TgChatRepository } from '../../database/repositories/tg-chat.repository';
import { TgMessageRepository } from '../../database/repositories/tg-message.repository';
import { IEntityMessage, IEntityTag } from '../../database/entities/types';
import { APP_LOGGER } from '../../logger/logger-channel-service';
import { ILoggerService } from '../../logger/types';


export const MESSAGE_SERVICE = 'MESSAGE_SERVICE';

@Injectable()
export class MessageService implements IMessageService {

  referencesMessage = ['forward_from_message', 'reply_to_message', 'thread'];
  referencesChat = ['chat', 'forward_from_chat', 'sender_chat'];
  referencesUser = ['from', 'forward_from'];

  referencesAll = [...this.referencesMessage, ...this.referencesChat, ...this.referencesUser];

  constructor(@Inject(APP_LOGGER) private logger: ILoggerService,
              @InjectRepository(TgMessageRepository) private messages: TgMessageRepository,
              @InjectRepository(TgChatRepository) private chats: TgChatRepository,
              @InjectRepository(TgUserRepository) private users: TgUserRepository) {

  }


  load(chatId: number, message_id: number): Promise<IEntityMessage> {
    return this.messages.findOne({where: {chatId, message_id, deleted: 0}, relations: ['from', 'chat']});
  }

  create(message: IEntityMessage): IEntityMessage {
    return this.messages.create(message);
  }

  async findOne(id: number): Promise<IEntityMessage> {
    return this.messages.findOne(
      id,
      {
        relations: this.referencesAll
      }
    );
  }

  async save(message: IEntityMessage): Promise<IEntityMessage> {

    this.fixReferencesId(message);

    try {
      await this.replaceExistMessageReferences(message);
      await this.messages.save(message);

    } catch (e) {
      this.logger.error('[MessageService] Message save error',e, message);
      return;
    }
    if (message.reply_to_message && !message.thread) {
      const reply_to = await this.findOne(message.reply_to_message.id);
      if (reply_to.thread) {
        message.thread = reply_to.thread;
      } else {
        message.thread = reply_to;
      }
      await this.messages.save(message);
    }
    return this.findOne(message.id);
  }

  async countReply(threadId: number): Promise<number> {
    return this.messages.count({where: {thread: {id: threadId}}});
  }

  async loadForwarded(chatId: number, message_id: number): Promise<IEntityMessage> {
    return this.messages.findOne({
      where: {
        forward_from_chat: {id: chatId},
        forward_from_message: {id: message_id}, deleted: false
      },
      relations: ['from', 'chat']
    });

  }

  async saveTags(message: IEntityMessage, tags: IEntityTag[]): Promise<IEntityMessage> {
    message.tags = tags;
    return this.messages.save(message);
  }

  async findUserMessages(userId: number, start?: number, length?: number): Promise<IEntityMessage[]> {
    return this.messages.find({
      where: {
        from: {id: userId}
      },
      relations: ['from', 'chat'],
      skip: start ? start : 0,
      take: length
    })
  }

  private fixReferencesId(message: IEntityMessage) {
    [
      'chat',
      'from',
      'sender_chat',
      'reply_to_message',
      'forward_from_chat',
      'forward_from',
      'forward_from_message',
    ].forEach((key) => {
      if (message[key] && message[key].id) {
        message[key].id = String(message[key].id)
        this.fixReferencesId(message[key]);
      }
    })
  }

  private async replaceExistMessageReferences(message: IEntityMessage) {
    for (const field of this.referencesMessage) {
      if (message[field] && !message[field].id) {
        const relation = await this.load(message[field].chat.id, message[field].message_id);
        if (relation) {
          message[field] = relation;
        }
      }
    }
  }

}

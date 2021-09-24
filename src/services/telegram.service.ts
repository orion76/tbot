import { Injectable } from '@nestjs/common';
import { TgMessage } from '../database/models/tg-message.model';
import { Op } from 'sequelize';
import { TgChat } from '../database/models/tg-chat.model';
import { TgUser } from '../database/models/tg-user.model';
import { IMessage } from '../types/message';
import { MessageService } from './message.service';
import { ITelegramService } from './types';


export const TELEGRAM_SERVICE = 'TELEGRAM_SERVICE';

@Injectable()
export class TelegramService implements ITelegramService {

  constructor() {

  }

  async saveNewChats(message: TgMessage) {
    await this.saveNotSaved(
      TgChat,
      ['chat', 'sender_chat', 'forward_from_chat'],
      'id',
      message
    );
  }

  async saveNewUsers(message: TgMessage) {
    await this.saveNotSaved(
      TgUser,
      ['from', 'forward_from'],
      'id',
      message
    );
  }

  async getNotSaved<T extends { id: number }>(modelClass: any, id_key: string, entities: T[]): Promise<T[]> {
    const ids = entities.map((entity) => entity[id_key]);

    const exists: T[] = await modelClass.findAll({where: {id: {[Op.in]: ids}}});

    return entities.filter((entity) => {
      const index = exists.findIndex((model) => model.id === entity.id);
      return index === -1;
    })
  }

  async saveNotSaved(modelClass: any, fields: string[], id_key: string, message: TgMessage) {
    const entities = fields.map((field) => message[field]).filter(Boolean);

    const chat_id=message.chat.id;
    
    if (modelClass === TgMessage) {
      entities.every((entity: TgMessage) => {
        if (!entity.id) {
          entity.id = MessageService.createId(chat_id, entity.message_id);
        }
      });
    }


    const entities_new = await this.getNotSaved(modelClass, 'id', entities);

    const unique_ids = new Set<number>();

    const entities_unique = entities_new
      .filter((entity) => {
        const id = entity[id_key];
        if (unique_ids.has(id)) {
          return false;
        } else {
          unique_ids.add(id);
          return true;
        }
      })

    if (entities_unique.length > 0) {
      try {
        console.log('SAVE NOT SAVED',entities_unique);
        entities_unique.forEach(async (entity) => await entity.save());
      } catch (e) {
        let n = 0;
      }

    }

  }

  replaceAssociation(message: TgMessage, fields: (keyof IMessage)[]) {

    fields.forEach((field) => {
      if (message[field]) {
        message[`${field}__id`] = message[field].id;
        message.setDataValue(field, undefined);
      }
    });
  }


  createId(message_id: number, chat_id: number) {
    return `${chat_id}__${message_id}`;
  }

}

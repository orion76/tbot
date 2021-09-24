import { Inject, Injectable } from '@nestjs/common';
import { TgMessage } from '../database/models/tg-message.model';
import { IMessage } from '../types/message';
import { TELEGRAM_SERVICE } from './telegram.service';
import { IMessageService, ITelegramService, ITreeNode } from './types';


export const MESSAGE_SERVICE = 'MESSAGE_SERVICE';

@Injectable()
export class MessageService implements IMessageService {

  constructor(@Inject(TELEGRAM_SERVICE) private telegramService: ITelegramService) {

  }

  static createId(chat_id: number, message_id: number) {
    return `${chat_id}__${message_id}`;
  }

  async countReply(id: string): Promise<number> {
    // this.sequelize.query('',{replacements:{}})
    return await TgMessage.count({where: {thread__id: id, deleted: 0}});
  }

  async load(chat_id: number, message_id: number): Promise<TgMessage> {
    const id = MessageService.createId(chat_id, message_id);
    return this.loadById(id);
  }

  async loadById(id: string): Promise<TgMessage> {
    return TgMessage.findByPk(id, {include: {all: true}});
  }

  async loadThread(start_id: string): Promise<TgMessage[]> {
    return await TgMessage.findAll({
      where: {thread__id: start_id, deleted: false},
      order: [['date', 'ASC']],
      include: {all: true}
    });
  }

  async loadForwarded(chat_id: number, message_id: number): Promise<TgMessage> {
    return await TgMessage.findOne({
      where: {forward_from_chat__id: chat_id, forward_from_message_id: message_id, deleted: false},
      include: {all: true}
    });
  }


  async delete(message: TgMessage): Promise<boolean> {
    message.deleted = true;
    try {
      await message.save({fields: ['deleted']});
    } catch (e) {
      console.log(e.message);
      return false;
    }
    return true;
  }

  async createThreadTree(root: TgMessage): Promise<ITreeNode> {

    const messages = await this.loadThread(root.id);

    const list: Map<string, ITreeNode> = new Map();
    const rootNode: ITreeNode = {message: root, children: []}
    list.set(root.id, rootNode);

    messages.forEach((message) => {
      list.set(message.id, {message: message, children: []});
    })

    messages.forEach((children) => {
      const parent = list.get(children.reply_to_message.id);
      const node = list.get(children.id);
      parent.children.push(node);
    })
    return rootNode;
  }

  async save(message_raw: IMessage | TgMessage): Promise<TgMessage> {

    let message: TgMessage;
    if (message_raw instanceof TgMessage) {
      message = message_raw;
    } else {
      message = TgMessage.build(message_raw, {include: {all: true}});
    }


    const id = MessageService.createId(message.chat.id, message.message_id);

    let message_saved = await TgMessage.findByPk(id);
    if (!message_saved) {
      message.id = id;
      await this.telegramService.saveNewChats(message);
      await this.telegramService.saveNewUsers(message);
      await this.prepareReplyTo(message);


      const fields: (keyof IMessage)[] = [
        'from', 'forward_from', // TgUser
        'chat', 'sender_chat', 'forward_from_chat', // TgChat
        'reply_to_message', 'thread'// TgMessage
      ]

      this.telegramService.replaceAssociation(message, fields);

      console.log('11111111\n', message.toJSON());
      try {
        message_saved = await message.save();
      } catch (e) {
        console.log('[ERROR] message.save()', Object.keys(e));
        console.log('[ERROR] ', e.fields, e.sql);
      }
    }
    return message_saved;
  }

  async prepareReplyTo(message: TgMessage) {
    if (message.reply_to_message) {
      await this.telegramService.saveNotSaved(TgMessage, ['reply_to_message', 'thread'], 'id', message);
      const reply_to = await this.load(message.chat.id, message.reply_to_message.message_id);
      if (!reply_to) {
        return;
      }
      if (reply_to.thread) {
        message['thread__id'] = reply_to.thread.id;
      } else {
        message['thread__id'] = reply_to.id;
      }
    }
  }

  create(message: TgMessage) {
    const data = {}
  }

}

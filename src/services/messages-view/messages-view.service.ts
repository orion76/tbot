import { Injectable } from '@nestjs/common';
import { IMessagesViewService } from '../types';
import { InjectRepository } from '@nestjs/typeorm';
import { TgMessageRepository } from '../../database/repositories/tg-message.repository';
import { TagRepository } from '../../database/repositories/tag.repository';
import { IEntityChat, IEntityMessage } from '../../database/entities/types';
import { InlineKeyboardButton } from 'node-telegram-bot-api';
import { Context } from 'telegraf';
import { ActionResponse } from '../../common/action-response';
import { AdminMessage } from '../../admin-messages';


export interface IMessagesData {
  list: IEntityMessage[];
  total: number;
}

export const MESSAGES_VIEW_SERVICE = 'MESSAGES_VIEW_SERVICE';

@Injectable()
export class MessagesViewService implements IMessagesViewService {

  per_page = 4;

  constructor(
    @InjectRepository(TagRepository) private tags: TagRepository,
    @InjectRepository(TgMessageRepository) private messages: TgMessageRepository,
  ) {

  }


  keyboardMessages(tag: string, page: number, messages: IEntityMessage[]): InlineKeyboardButton[][] {

    return messages.map((message) => {
      return [{
        callback_data: ActionResponse.decodeViewTag(tag, page, message.id),
        text: message.title
      }]
    })
  }

  async keyboardPager(tag: string, total: number, page: number) {
    const pages_count = Math.ceil(total / this.per_page);
    const pager: InlineKeyboardButton[] = [];
    if (pages_count === 1) {
      return pager;
    }
    const last_index = pages_count - 1;

    if (page > 0) {
      pager.push({callback_data: ActionResponse.decodeViewTag(tag, page - 1), text: '<<'});
    }
    pager.push({
      callback_data: 'current',
      text: AdminMessage.viewPager(total, page + 1, pages_count),
    });

    if (page < last_index) {
      pager.push({callback_data: ActionResponse.decodeViewTag(tag, page + 1), text: '>>'});
    }
    return pager;
  }


  /**
   *
   * @param ctx
   * @param tag - Messages tag
   * @param page - current page index
   * @param message_id - current message index
   */
  async sendTagMessagesView(ctx: Context<any>, tag: string, page: number, message_id: number) {

    const {chat} = ctx;
    const target_id = ctx.callbackQuery.message.message_id;


    const start = page * this.per_page;
    const messages: IMessagesData = await this.loadMessages(chat, tag, start);

    let message: IEntityMessage;
    if (messages.total > 0) {
      if (message_id) {
        message = messages.list.find((msg, index, arr) => {
          return Number(msg.id) === message_id;
        })
        let n = 0;
      } else {
        message = messages.list[0]
      }
      const text = message.text;
      const inline_keyboard = await this.createKeyboard(tag, page, messages);
      const extra: any = {reply_markup: {inline_keyboard}};

      await ctx.telegram.editMessageText(chat.id, target_id, undefined, text, extra);
    } else {
      await ctx.telegram.editMessageText(
        chat.id,
        target_id,
        undefined,
        AdminMessage.tagContentEmpty(tag),
        {parse_mode: 'HTML'}
      );
    }


  }

  async loadMessages(chat: IEntityChat, tag: string, start: number): Promise<IMessagesData> {
    const total = await this.messages.findByTagCount(tag, chat.id, start, this.per_page);
    const ids = await this.messages.findByTag(tag, chat.id, start, this.per_page);
    const list = await this.messages.loadMultiple(ids);
    return {total, list}
  }

  async createKeyboard(tag: string, page: number, messages: IMessagesData): Promise<InlineKeyboardButton[][]> {
    const keyboardPager = await this.keyboardPager(tag, messages.total, page);
    const keyboardMessages = await this.keyboardMessages(tag, page, messages.list);
//eyJhY3Rpb24iOiJ2aWV3IiwiZGF0YSI6eyJ0YWciOiJncm91cGluZm8iLCJwYWdlIjowLCJtZXNzYWdlX2lkIjoiMjE0In19
    return [keyboardPager, ...keyboardMessages];
  }

  async startMessagesView(ctx: Context<any>, tag: string) {
    const {chat} = ctx;

    const messages = await this.loadMessages(chat, tag, 0)

    if (messages.total > 0) {

      const inline_keyboard = await this.createKeyboard(tag, 0, messages);
      const extra: any = {reply_markup: {inline_keyboard,resize_keyboard:true}};
      const current = messages.list[0];

      await ctx.reply(current.text as any, extra);
    } else {
      const text: any = AdminMessage.tagContentEmpty(tag);
      const extra: any = {parse_mode: 'HTML'};
      await ctx.reply(text, extra);
    }
  }

}

import { Injectable } from '@nestjs/common';
import { IMessagesViewService, INavigateIds } from '../types';
import { InjectRepository } from '@nestjs/typeorm';
import { TgMessageRepository } from '../../database/repositories/tg-message.repository';
import { TagRepository } from '../../database/repositories/tag.repository';
import { IEntityMessage } from '../../database/entities/types';
import { InlineKeyboardButton, InlineKeyboardMarkup } from 'node-telegram-bot-api';
import { Context } from 'telegraf';
import { ESmiles } from '../../formatter/message.formatter';


export const MESSAGES_VIEW_SERVICE = 'MESSAGES_VIEW_SERVICE';

@Injectable()
export class MessagesViewService implements IMessagesViewService {

  actionPrefix = 'message_view_';

  constructor(
    @InjectRepository(TagRepository) private tags: TagRepository,
    @InjectRepository(TgMessageRepository) private messages: TgMessageRepository,
  ) {

  }

  showMessagesWithPager(messages: IEntityMessage[], ids?: INavigateIds) {
    const {current, prev} = ids ? ids : {current: 0, prev: null};

    const text = messages[current].text;
    const info: InlineKeyboardButton[] = [];
    const arrows: InlineKeyboardButton[] = [];
    const pager_titles: InlineKeyboardButton[][] = [];

    info.push({callback_data: 'none', text: `current:${current} total:${messages.length}`})
    
    if (current > 0) {
      arrows.push({callback_data: `${this.actionPrefix}${current}__${current - 1}`, text: '<<'})
    }
    if (current < (messages.length - 1)) {
      arrows.push({callback_data: `${this.actionPrefix}${current}__${current + 1}`, text: `>>`})
    }
    const count = messages.length;
    const first = current < 3 ? 0 : current - 2;
    const last = current > (count - 2) ? count : current + 3;

    const titles = messages.slice(first, last).map((message) => message.title);
    for (let i = first; i < last; i++) {
      const title = titles.shift();
      const button_text = i === current ? `${ESmiles.high_voltage_sign} ${title}` : title;
      pager_titles.push([{callback_data: `${this.actionPrefix}${current}__${i}`, text: ` (${i}) ${button_text}`}])
    }

    return {text, keyboard: [arrows,info ,...pager_titles]};
  }

  extractCurrentIndex(data: string): INavigateIds {
    const ids: string = data.trim().replace(this.actionPrefix, '');
    const [prev, current] = ids.split('__').map(Number);
    return {prev, current};
  }

  async open(ctx: Context<any>, messages: IEntityMessage[]) {
    const {text, keyboard} = this.showMessagesWithPager(messages);
    const markup: InlineKeyboardMarkup = {inline_keyboard: keyboard};
    const extra: any = {
      reply_markup: markup
    }
    await ctx.reply(text as any, extra);
  }


  async navigate(ctx: Context<any>, messages: IEntityMessage[], ids: INavigateIds) {
    const {text, keyboard} = this.showMessagesWithPager(messages, ids);
    const {chat, message_id} = ctx.callbackQuery.message;

    const markup: InlineKeyboardMarkup = {inline_keyboard: keyboard};

    await ctx.telegram.editMessageText(chat.id, message_id, undefined, text, {
      reply_markup: markup as any
    });
  }
}

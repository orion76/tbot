import { Inject, Injectable } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { MessageId } from 'node-telegram-bot-api';
import { MESSAGE_SERVICE } from '../services/message.service';
import { TgMessage } from '../database/models/tg-message.model';

import { IMessage } from '../types/message';
import { InlineKeyboardMarkup } from 'typegram/inline';
import { ICopyToChannelService } from './types';
import { BOT_NAME } from '../app.module';
import { IMessageService } from '../services/types';


export const COPY_TO_CHANNEL_SERVICE = 'COPY_TO_CHANNEL_SERVICE'

@Injectable()
export class CopyToChannelService implements ICopyToChannelService {

  constructor(@InjectBot(BOT_NAME) private readonly bot: Telegraf<Context>,
              // @Inject(APP_CONFIG) private config: IAppConfig,
              @Inject(MESSAGE_SERVICE) private messageService: IMessageService) {
  }

  createCommentButtonMarkup(thread: TgMessage,reply_count:number):InlineKeyboardMarkup {
    return {
      inline_keyboard: [
        [{url: `https://t.me/${thread.chat.username}/${thread.message_id}?comment=1`, text: `Comments ${reply_count}`}]
      ]
    }
  }
  async updateTreadStart(thread: TgMessage, channel_post: TgMessage,replyCount:number): Promise<any> {
    return this.bot.telegram.editMessageReplyMarkup(
      channel_post.chat.id,
      channel_post.message_id,
      undefined,
      this.createCommentButtonMarkup(thread, replyCount));
  }

  async forwardTreadStart(channel_id: number, thread: TgMessage,reply_count:number): Promise<MessageId> {

    const new_channel_post = await this.bot.telegram.sendMessage(
      channel_id, thread.text,
      {
        reply_markup: this.createCommentButtonMarkup(thread,reply_count),
      }
    );

    // const report = {
    //   channel: channel_id,
    //   message: thread.message_id,
    //   new_message: new_channel_post.message_id
    // }
    //
    // console.log('Move message with reply to channel', report);
    new_channel_post['forward_from_chat__id'] = thread.chat.id;
    new_channel_post.forward_from_message_id = thread.message_id;
    await this.messageService.save(new_channel_post as IMessage);

    return new_channel_post;
  }

}

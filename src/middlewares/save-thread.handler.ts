import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TgMessageRepository } from '../database/repositories/tg-message.repository';
import { IMessageHandler } from './types';
import { Context } from 'telegraf';
import { IEntityMessage } from '../database/entities/types';
import { MESSAGE_SERVICE } from '../services/message/message.service';
import { IMessageService } from '../services/types';
import { InlineKeyboardMarkup } from 'typegram/inline';
import { APP_CONFIG } from '../app-config.module';
import { IAppConfig } from '../types/types';
import { MessageFormatter } from '../formatter/message.formatter';


@Injectable()
export class SafeThreadHandler implements IMessageHandler {

  constructor(
    @Inject(APP_CONFIG) private config: IAppConfig,
    @InjectRepository(TgMessageRepository) private messages: TgMessageRepository,
    @Inject(MESSAGE_SERVICE) private messageService: IMessageService,
  ) {

  }

  async handle(ctx: Context<any>, message: IEntityMessage) {
    if (message.reply_to_message) {
      let replyCount = 0;
      if (message.thread) {
        replyCount = await this.messageService.countReply(message.thread.id);

        if (replyCount > this.config.reply_count) {
          const thread = await this.messageService.findOne(message.thread.id);
          let channel_post = await this.messageService.loadForwarded(thread.chat.id, thread.id);
          const keyboard = this.createCommentButtonMarkup(thread, replyCount);
          if (!channel_post) {
            await this.forwardToChannelPost(ctx, thread, keyboard)
          } else {
            await this.updateChannelReplyCount(ctx, channel_post, keyboard)
          }
        }
      }
    }
  }

  async updateChannelReplyCount(ctx: Context<any>, channel_post: IEntityMessage, keyboard: InlineKeyboardMarkup) {
    await ctx.telegram.editMessageReplyMarkup(
      channel_post.chat.id,
      channel_post.message_id,
      undefined,
      keyboard
      // this.createCommentButtonMarkup(thread, replyCount)
    );
  }

  async forwardToChannelPost(ctx: Context<any>, thread: IEntityMessage, reply_markup: InlineKeyboardMarkup) {
    let new_channel_post: any;

    const text = [
      MessageFormatter.author(thread.from),
      thread.text
    ];


    try {
      new_channel_post = await ctx.telegram.sendMessage(
        this.config.channel_id,
        text.join('\n'),
        {reply_markup});
    } catch (e) {
      console.log(e.message);
    }


    if (new_channel_post) {
      const channel_post = this.messageService.create(new_channel_post);
      channel_post.from = thread.from;
      channel_post.forward_from_chat = thread.chat;
      channel_post.forward_from_message = thread;
      await this.messageService.save(channel_post);
    }
  }

  createCommentButtonMarkup(thread: IEntityMessage, reply_count: number): InlineKeyboardMarkup {
    const username = thread.chat.username;
    return {
      inline_keyboard: [
        [{url: `https://t.me/${username}/${thread.message_id}?comment=1`, text: `Comments ${reply_count}`}]
      ]
    }
  }

}

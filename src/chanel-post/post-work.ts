import { InjectBot, Update, } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { Inject } from '@nestjs/common';
import { MESSAGE_SERVICE } from '../services/message/message.service';

import { ILoggerService } from '../logger/types';
import { APP_LOGGER } from '../logger/logger-channel-service';
import { BOT_NAME } from '../app.module';
import { IMessageService } from '../services/types';
import { InjectRepository } from '@nestjs/typeorm';
import { TgUserRepository } from '../database/repositories/tg-user.repository';
import { InlineKeyboardMarkup, InlineQueryResultArticle } from 'node-telegram-bot-api';
import { TgMessageRepository } from '../database/repositories/tg-message.repository';

@Update()
export class PostWork {


  constructor(
    @InjectBot(BOT_NAME) private readonly bot: Telegraf<Context>,
    @Inject(MESSAGE_SERVICE) private messageService: IMessageService,
    @Inject(APP_LOGGER) private logger: ILoggerService,
    @InjectRepository(TgUserRepository) private users: TgUserRepository,
    @InjectRepository(TgMessageRepository) private messages: TgMessageRepository
  ) {
  }


  inlineQueryArticle(id: string, title: string, message_text: string, keyboard?: InlineKeyboardMarkup): InlineQueryResultArticle {
    const article: InlineQueryResultArticle = {
      id,
      type: 'article',
      title,
      input_message_content: {message_text},
    }

    if (keyboard) {
      article.reply_markup = keyboard;
    }

    return article;
  }



}


/**
 * ["callback_query"] |
 *  ["channel_post"] |
 *  ["chat_member"] |
 *  ["chosen_inline_result"] |
 *  ["edited_channel_post"] |
 *  ["edited_message"] |
 *  ["inline_query"] |
 *  ["message"] |
 *  ["my_chat_member"] |
 *  ["pre_checkout_query"] |
 *  ["poll_answer"] |
 *  ["poll"] |
 *  ["shipping_query"] |
 *  ["forward_date"] |
 *  ["channel_chat_created"] |
 *  ["connected_website"] |
 *  ["delete_chat_photo"] |
 *  ["group_chat_created"] |
 *  ["invoice"] |
 *  ["left_chat_member"] |
 *  ["message_auto_delete_timer_changed"] |
 *  ["migrate_from_chat_id"] |
 *  ["migrate_to_chat_id"] |
 *  ["new_chat_members"] |
 *  ["new_chat_photo"] |
 *  ["new_chat_title"] |
 *  ["passport_data"] |
 *  ["proximity_alert_triggered"] |
 *  ["pinned_message"] |
 *  ["successful_payment"] |
 *  ["supergroup_chat_created"] |
 *  ["voice_chat_scheduled"] |
 *  ["voice_chat_started"] |
 *  ["voice_chat_ended"] |
 *  ["voice_chat_participants_invited"] |
 *  ["animation"] |
 *  ["document"] |
 *  ["audio"] |
 *  ["contact"] |
 *  ["dice"] |
 *  ["game"] |
 *  ["location"] |
 *  ["photo"] |
 *  ["sticker"] |
 *  ["text"] |
 *  ["venue"] |
 *  ["video"] |
 *  ["video_note"] |
 *  ["voice"] |
 *
 */

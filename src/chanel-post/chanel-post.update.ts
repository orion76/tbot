import { Action, Command, Help, InjectBot, On, Start, Update, } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { Inject } from '@nestjs/common';
import { MESSAGE_SERVICE } from '../services/message/message.service';

import { ILoggerService } from '../logger/types';
import { APP_LOGGER } from '../logger/logger-channel-service';
import { IAppConfig } from '../types/types';
import { BOT_NAME } from '../app.module';
import { IMessageService, IMessagesViewService, ITagService } from '../services/types';
import { InjectRepository } from '@nestjs/typeorm';
import { TgUserRepository } from '../database/repositories/tg-user.repository';
import { IEntityMessage } from '../database/entities/types';
import { TAG_SERVICE } from '../services/tag/tag.service';
import { MessageFormatter } from '../formatter/message.formatter';
import { TgMessageRepository } from '../database/repositories/tg-message.repository';
import { AdminMessage } from '../admin-messages';
import { APP_CONFIG } from '../app-config.module';
import { MESSAGES_VIEW_SERVICE } from '../services/messages-view/messages-view.service';

@Update()
export class ChanelPostUpdate {

  constructor(
    @InjectBot(BOT_NAME) private readonly bot: Telegraf<Context>,
    @Inject(APP_CONFIG) private config: IAppConfig,
    @Inject(MESSAGE_SERVICE) private messageService: IMessageService,
    @Inject(TAG_SERVICE) private tagService: ITagService,
    @Inject(MESSAGES_VIEW_SERVICE) private messageViewService: IMessagesViewService,
    @Inject(APP_LOGGER) private logger: ILoggerService,
    @InjectRepository(TgUserRepository) private users: TgUserRepository,
    @InjectRepository(TgMessageRepository) private messages: TgMessageRepository
  ) {
  }


  @Start()
  async onStart(ctx: Context<any>, next): Promise<string> {
    const me = await this.bot.telegram.getMe();
    const {message} = ctx.update;
    const [start, args] = message.text.split(' ');
    const [command, username] = args.split('--');
    switch (command) {
      case 'welcome':
        // const tag = 'maininfo';
        // const messages = this.messages.findByTag(tag, username, 0, 1);
        const messages = await this.messages.findUserMessages(message.chat.id, 0);
        this.messageViewService.open(ctx, messages)
        break;
      default:
        return `Hey, I'm ${me.first_name}`;
    }
  }

  @Help()
  async onHelp(): Promise<string> {
    return 'Send me any text';
  }

//
  @On(['text'] as any)
  async onText(ctx: Context<any>, next: any): Promise<any> {

    // this.logger.debug('!!!onText\n', ctx.update.message);

    const message = this.messageService.create(ctx.update.message);

    if (true || message.chat.username !== 'orion76') {
      next(ctx);
      return;
    }

    const messages = await this.messages.findUserMessages(message.from.id, 0, 3);

    const output = messages.map((message) => MessageFormatter.anons(message)).join('\n');


    await ctx.replyWithHTML(output, {disable_web_page_preview: true});
    next(ctx);

  };

  @On(['message'] as any)
  async onMessage(ctx: Context<any>, next: any): Promise<any> {

    // this.logger.debug('!!!onMessage\n', ctx.update.message);


    if (ctx.message.chat.type === 'private') {
      next(ctx);
      return;
    }
    const message: IEntityMessage = await this.messageService.load(ctx.chat.id, ctx.message.message_id);


    next(ctx);
  }


  /**
   * COMMANDS

   * welcome - Информация о группе
   *
   * @param ctx
   */

  @Command(['bot'])
  async commandBotInfo1(ctx: Context<any>) {
    const bot = await ctx.telegram.getMe();
    delete bot.id;

    const chat = await ctx.telegram.getChat(this.config.chat_id);
    const channel = await ctx.telegram.getChat(this.config.channel_id);

    let chat_admin;
    let channel_admin;
    try {
      chat_admin = await ctx.telegram.getChatAdministrators(this.config.chat_id);
    } catch (e) {
      chat_admin = e.message;
    }

    try {
      channel_admin = await ctx.telegram.getChatAdministrators(this.config.channel_id);
    } catch (e) {
      channel_admin = e.message;
    }

    const info = {
      bot,
      chat: {info: chat, admin: chat_admin},
      channel: {info: channel, admin: channel_admin},
    }

    await ctx.replyWithHTML('<code>' + JSON.stringify(info, null, 4) + '</code>');
  }


  @Command(['welcome'] as any)
  async commandWelcome(ctx: Context<any>) {
    this.logger.debug('commandWelcome', ctx.update);
    const message: IEntityMessage = ctx.update.message;
    await ctx.telegram.sendMessage(
      message.chat.id,
      AdminMessage.welcome(message.from.username),
      {
        reply_markup: {
          inline_keyboard: [[
            {
              text: 'Подробнее о движении',
              url: `https://t.me/gpbPostBot?start=welcome--${message.chat.username}`
            },
          ]]
        }
      }
    );
  }


  @Action([/message_view.*/] as any)
  async actionMessagesView(ctx: Context<any>) {
    const {message, data} = ctx.callbackQuery;

    const ids = this.messageViewService.extractCurrentIndex(data);
    
    const messages = await this.messages.findUserMessages(message.chat.id);
    
    this.messageViewService.navigate(ctx, messages, ids);
    console.log('+++ action:next\n', ctx.update);
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

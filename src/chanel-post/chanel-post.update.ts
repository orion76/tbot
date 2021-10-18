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
import { IEntityChat, IEntityMessage, IEntityUser } from '../database/entities/types';
import { TAG_SERVICE } from '../services/tag/tag.service';
import { MessageFormatter } from '../formatter/message.formatter';
import { TgMessageRepository } from '../database/repositories/tg-message.repository';
import { AdminMessage } from '../admin-messages';
import { APP_CONFIG } from '../app-config.module';
import { MESSAGES_VIEW_SERVICE } from '../services/messages-view/messages-view.service';
import { ActionResponse, EAction, EActionViewType } from '../common/action-response';

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
        await this.messageViewService.startMessagesView(ctx, 'groupinfo');
        break;
      case 'botinfo':
        await this.messageViewService.startMessagesView(ctx, 'botinfo');
        break
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

  @Command(['botdebug'] as any)
  async commandBotDebug(ctx: Context<any>) {
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
    await this.showWelcome(ctx, message.chat, [message.from])
  }

  async showWelcome(ctx: Context<any>, chat: IEntityChat, users: IEntityUser[]) {
    this.logger.debug('commandWelcome', ctx.update);

    const names = users.map(this.getUserName);

    await ctx.telegram.sendMessage(
      chat.id,
      AdminMessage.welcome(names.join(', ')),
      {
        reply_markup: {
          inline_keyboard: [[
            {
              text: 'Подробнее о движении',
              url: `https://t.me/gpbPostBot?start=welcome--${chat.username}`
            },
          ]]
        }
      }
    );
  }

  @Command(['botinfo'] as any)
  async commandBotInfo(ctx: Context<any>) {
    this.logger.debug('commandBotInfo', ctx.update);
    const message: IEntityMessage = ctx.message;
    await ctx.telegram.sendMessage(
      message.chat.id,
      AdminMessage.botinfo(),
      {
        reply_markup: {
          inline_keyboard: [[
            {
              text: 'Бот - руководство пользователя',
              url: `https://t.me/gpbPostBot?start=botinfo`
            },
          ]]
        }
      }
    );
  }

  @Action([/.*/] as any)
  async actionMessagesView(ctx: Context<any>) {
    const {message, data} = ctx.callbackQuery;

    const response = ActionResponse.encode(data);

    const {action, type} = response;
    switch (Number(action)) {
      case EAction.VIEW:
        switch (Number(type)) {
          case EActionViewType.TAG:
            const {tag, page, message_id} = ActionResponse.encodeViewTag(response.data);
            await this.messageViewService.sendTagMessagesView(ctx, tag, Number(page), Number(message_id));

            break;
        }
        break;
    }
  }

  @On(['chat_member'] as any)
  async onChatMember(ctx: Context<any>, next: any): Promise<any> {

    console.log('>>> chat_member\n', ctx.update);
    next(ctx);
  }


  @On(['my_chat_member'] as any)
  async onMyChatMember(ctx: Context<any>, next: any): Promise<any> {

    console.log('>>> my_chat_member\n', ctx.update);
    next(ctx);
  }


  @On(['left_chat_member'] as any)
  async onLeftChatMember(ctx: Context<any>, next: any): Promise<any> {

    console.log('>>> left_chat_member\n', ctx.update);
    next(ctx);
  }

  getUserName(user:IEntityUser){
    return user.first_name || user.username;
  }

  @On(['new_chat_members'] as any)
  async onNewChatMembers(ctx: Context<any>, next: any): Promise<any> {
let n=0;
    await this.showWelcome(ctx, ctx.chat, ctx.message.new_chat_members);
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

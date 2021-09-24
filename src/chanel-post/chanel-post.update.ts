import { Help, InjectBot, On, Start, Update, } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { Inject } from '@nestjs/common';
import { COPY_TO_CHANNEL_SERVICE } from './copy-to-channel.service';
import { MESSAGE_SERVICE } from '../services/message.service';

import { ILoggerService } from '../logger/types';
import { APP_LOGGER } from '../logger/logger-channel-service';
import { IAppConfig } from '../types/types';
import { ICopyToChannelService } from './types';
import { appConfig, BOT_NAME } from '../app.module';
import { IControlService, IMessageService } from '../services/types';
import { CONTROL_SERVICE } from '../services/control.service';

@Update()
export class ChanelPostUpdate {
  private config: IAppConfig = appConfig;

  constructor(
    @InjectBot(BOT_NAME) private readonly bot: Telegraf<Context>,
    @Inject(COPY_TO_CHANNEL_SERVICE) private copyService: ICopyToChannelService,
    // @Inject(APP_CONFIG) private config: IAppConfig,
    @Inject(MESSAGE_SERVICE) private messageService: IMessageService,
    @Inject(APP_LOGGER) private logger: ILoggerService,
    @Inject(CONTROL_SERVICE) private control: IControlService,
  ) {
  }

  @Start()
  async onStart(): Promise<string> {
    const me = await this.bot.telegram.getMe();
    return `Hey, I'm ${me.first_name}`;
  }

  @Help()
  async onHelp(): Promise<string> {
    return 'Send me any text';
  }

//
//   @On(['text'])
  async onText(reversedText: Context<any>): Promise<any> {
    await this.messageService.save(reversedText.update.channel_post);

  };

  @On(['channel_post'])
  async onChannelPost(reversedText: Context<any>): Promise<any> {
    // const message = TgMessage.build(reversedText.update.channel_post, {include: {all: true}});
    // await this.messageService.save(message);

  };

  @On(['message'])
  async onMessage(reversedText: Context<any>): Promise<any> {
    this.control.isGoneCrazy();
    
    const message_saved = await this.messageService.save(reversedText.update.message);
    this.logger.debug('!!!onMessage\n', reversedText.update.message);

    // const {config} = this;

    if (message_saved.reply_to_message) {
      let replyCount = 0;
      if (message_saved['thread__id']) {
        replyCount = await this.messageService.countReply(message_saved['thread__id']);
      }

      if (replyCount > this.config.reply_count) {
        const thread = await this.messageService.loadById(message_saved['thread__id']);
        let channel_post = await this.messageService.loadForwarded(thread.chat.id, thread.message_id);

        if (!channel_post) {
          await this.copyService.forwardTreadStart(this.config.channel_id, thread, replyCount);
        } else {
          await this.copyService.updateTreadStart(thread, channel_post, replyCount);
        }
      }
    }
  }

  @On(['edited_channel_post']) onEditedChannelPost(reversedText: Context): void {
    this.logger.debug('onEditedChannelPost', reversedText);
  }

  @On(['edited_message']) onEditedMessage(reversedText: Context): void {
    this.logger.debug('onEditedMessage', reversedText);
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
 *  [
 *     ("callback_query" |
 *      "channel_post" |
 *  "chat_member" |
 *  "chosen_inline_result" |
 *  "edited_channel_post" |
 *  "edited_message" |
 *  "inline_query" |
 *  "message" |
 *  "my_chat_member" |
 *  "pre_checkout_query" |
 *  "poll_answer" |
 *  "poll" |
 *  "shipping_query" |
 *  "forward_date" |
 *  "channel_chat_created" |
 *  "connected_website" |
 *  "delete_chat_photo" |
 *  "group_chat_created" |
 *  "invoice" |
 *   "left_chat_member" |
 *  "message_auto_delete_timer_changed" |
 *  "migrate_from_chat_id" |
 *  "migrate_to_chat_id" |
 *  "new_chat_members" |
 *  "new_chat_photo" |
 *  "new_chat_title" |
 *  "passport_data" |
 *  "proximity_alert_triggered" |
 *  "pinned_message" |
 *  "successful_payment" |
 *  "supergroup_chat_created" |
 *  "voice_chat_scheduled" |
 *  "voice_chat_started" |
 *  "voice_chat_ended" |
 *  "voice_chat_participants_invited" |
 *  "animation" |
 *  "document" |
 *  "audio" |
 *  "contact" |
 *  "dice" |
 *  "game" |
 *  "location" |
 *  "photo" |
 *  "sticker" |
 *  "text" |
 *  "venue" |
 *  "video" |
 *  "video_note" |
 *  "voice")[]])
 */

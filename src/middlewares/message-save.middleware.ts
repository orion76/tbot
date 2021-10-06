import { Inject, Injectable } from '@nestjs/common';
import { MiddlewareFn, MiddlewareObj } from 'telegraf/typings/middleware';
import { Context } from 'telegraf';
import { IEntityMessage } from '../database/entities/types';
import { IAppConfig } from '../types/types';
import { CONTROL_SERVICE } from '../services/control/control.service';
import { IControlService, IMessageService, ITagService } from '../services/types';
import { MESSAGE_SERVICE } from '../services/message/message.service';
import { TAG_SERVICE } from '../services/tag/tag.service';
import { InjectRepository } from '@nestjs/typeorm';
import { TgMessageRepository } from '../database/repositories/tg-message.repository';
import { DeepPartial } from 'typeorm';
import { InlineKeyboardMarkup } from 'typegram/inline';
import { APP_CONFIG } from '../app-config.module';
import { IMessageHandler } from './types';


@Injectable()
export class MessageSaveMiddleware implements MiddlewareObj<any> {


  constructor(
    @Inject(APP_CONFIG) private config: IAppConfig,
    @Inject(CONTROL_SERVICE) private control: IControlService,
    @Inject(MESSAGE_SERVICE) private messageService: IMessageService,
    @Inject(TAG_SERVICE) private tagService: ITagService,
    // @Inject(COPY_TO_CHANNEL_SERVICE) private copyService: ICopyToChannelService,
    @InjectRepository(TgMessageRepository) private messages: TgMessageRepository
  ) {

  }

  async saveTags(message: IEntityMessage) {
    const message_tags = this.tagService.searchTags(message.text);
    if (message_tags.length > 0) {
      const tags = await this.tagService.save(message_tags);
      if (tags.length > 0) {
        await this.messageService.saveTags(message, tags);
      }
    }
  }

  async saveThread(ctx: Context<any>, message: IEntityMessage) {
    if (message.reply_to_message) {
      let replyCount = 0;
      if (message.thread) {
        replyCount = await this.messageService.countReply(message.thread.id);

        if (replyCount > this.config.reply_count) {
          const thread = await this.messageService.findOne(message.thread.id);
          let channel_post = await this.messageService.loadForwarded(thread.chat.id, thread.message_id);

          if (!channel_post) {
            let new_channel_post: any;
            try {
              new_channel_post = await ctx.telegram.sendMessage(
                thread.chat.id, thread.text,
                {
                  reply_markup: this.createCommentButtonMarkup(thread, replyCount),
                }
              );
            } catch (e) {
              console.log(e.message);
            }

            if (new_channel_post) {
              const entity = this.messageService.create(new_channel_post);

              entity.forward_from_message = thread;
              await this.messageService.save(new_channel_post);
            }

          } else {
            await ctx.telegram.editMessageReplyMarkup(
              channel_post.chat.id,
              channel_post.message_id,
              undefined,
              this.createCommentButtonMarkup(thread, replyCount));
          }
        }
      }
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


  middleware(handlers?: IMessageHandler[]): MiddlewareFn<any> {
    const _this = this;
    console.log('middleware()');
    return async (ctx: Context<any>, next: any) => {
      this.control.isGoneCrazy();


      if (!_this.isChatMessage(ctx.message)) {
        next(ctx);
        return;
      }

      const message = this.messages.create(ctx.message as DeepPartial<IEntityMessage>);
      if (ctx.message.photo) {
        message.text = ctx.message.caption ? ctx.message.caption : 'photo'
      }
      //
      // // const ttt= await this.users.findOne({where:{id:In([message.from.id])}});
      await this.messageService.save(message);

      if (handlers) {
        for (const handler of handlers) {
          await handler.handle(ctx, message);
        }
      }
      next(ctx);
      // await this.saveThread(ctx, message);
      // await this.saveTags(message);
      console.log('MessageSaveMiddleware');
    };
  }

  isChatMessage(message: IEntityMessage) {
    return message?.chat && message?.chat.type === 'supergroup';
  }
}

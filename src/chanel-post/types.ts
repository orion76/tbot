import { TgMessage } from '../database/models/tg-message.model';
import { InlineKeyboardMarkup } from 'typegram/inline';

export interface ICopyToChannelService {
  forwardTreadStart(channel_id: number, thread: TgMessage, reply_count: number);

  updateTreadStart(thread: TgMessage, channel_post: TgMessage, replyCount: number): Promise<any>;

  createCommentButtonMarkup(thread: TgMessage, reply_count: number): InlineKeyboardMarkup;
}

import { InlineKeyboardMarkup } from 'typegram/inline';
import { IEntityMessage } from '../database/entities/types';

export interface ICopyToChannelService {
  forwardTreadStart(channel_id: number, thread: IEntityMessage, reply_count: number);

  updateTreadStart(thread: IEntityMessage, channel_post: IEntityMessage, replyCount: number): Promise<any>;

  createCommentButtonMarkup(thread: IEntityMessage, reply_count: number): InlineKeyboardMarkup;
}

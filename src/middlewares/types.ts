import { Context } from 'telegraf';
import { IEntityMessage } from '../database/entities/types';

export interface IMessageHandler {
  handle(ctx: Context<any>, message: IEntityMessage)
}

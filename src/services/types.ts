import { IEntityMessage, IEntityTag } from '../database/entities/types';
import { Context } from 'telegraf';

export interface IMessagesViewPagerData {
  first: number;
  last: number;
  item: number;
  page: number
  pages_count: number;
  per_page: number;
}

export interface ITelegramService {
}

export interface IMessageService {
  load(chatId: number, message_id: number): Promise<IEntityMessage>;

  save(message: IEntityMessage): Promise<IEntityMessage>;

  create(message: IEntityMessage): IEntityMessage;

  countReply(threadId: number): Promise<number>;

  findOne(id: number): Promise<IEntityMessage>;

  loadForwarded(chatId: number, message_id: number): Promise<IEntityMessage>;

  saveTags(message: IEntityMessage, tags: IEntityTag[]): Promise<IEntityMessage>;

  findUserMessages(userId: number, start?: number, length?: number): Promise<IEntityMessage[]>;
}

export interface IMessagesViewService {

  startMessagesView(ctx: Context<any>, tag: string);

  sendTagMessagesView(ctx: Context<any>, tag: string, page: number, item: number);

}


export type TActions = 'view';

export interface IActionViewTag {
  tag: string,
  page: number,
  message_id?: number
}


export interface IActionResponse {
  action: TActions;
  type:string,
  data: any
}

export interface ITagService {
  searchTags(text: string): string[];

  findByTitle(tags: string[]): Promise<Record<string, IEntityTag>>;

  save(tags: string[]): Promise<IEntityTag[]>;

  // load(chatId: number, message_id: number): Promise<IEntityMessage>;
  // save(message:IEntityMessage):Promise<IEntityMessage>;
  // create(message:IEntityMessage):IEntityMessage;
  // countReply(threadId: number):Promise<number>;
  // findOne(id:number):Promise<IEntityMessage>;
  // loadForwarded(chatId: number, message_id: number): Promise<IEntityMessage>;
}

export interface IControlService {
  isGoneCrazy();

}

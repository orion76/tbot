import { IEntityMessage, IEntityTag } from '../database/entities/types';
import { Context } from 'telegraf';


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
  open(ctx: Context<any>, messages: IEntityMessage[]);

  navigate(ctx: Context<any>, messages: IEntityMessage[], ids: INavigateIds);

  extractCurrentIndex(data: string): INavigateIds;
}

export interface INavigateIds {
  prev: number,
  current: number
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

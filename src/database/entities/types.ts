import { ChatType } from 'node-telegram-bot-api';

export interface IEntity {
  id?: any;
  title?: string;
  deleted?: boolean;
}


export interface IEntityChat extends IEntity {
  username: string;
  type: ChatType;
}

export interface IEntityUser extends IEntity {
  is_bot: boolean;
  first_name: string;
  username: string;
}

export interface IEntityPhoto extends IEntity {
  file_id:string,
  file_unique_id:string,
  file_size: number,
  width: number,
  height: number
}

export interface IEntityMessage extends IEntity {
  id?: number;
  message_id: number;
  deleted?: boolean;

  text?: string;
  caption?: string;
  photo?: IEntityPhoto[];
  forward_from_message: IEntityMessage;
  reply_to_message?: IEntityMessage;
  thread: IEntityMessage;

  chat: IEntityChat;
  sender_chat: IEntityChat;
  forward_from_chat: IEntityChat;

  from: IEntityUser;
  forward_from: IEntityUser;

  tags: IEntityTag[];

  getChats(): IEntityChat[];

  getMessages(): IEntityMessage[];

  getUsers(): IEntityUser[];
}

export interface IEntityTag extends IEntity {
  children: IEntityTag[];
  parent: IEntityTag;
}


export interface ITgConfig extends IEntity {


  chat_id: number;
  channel_id: number;
  config: string;
}


export interface IEntityRef<S, T> {
  id: number;
  type: string;
  source: S;
  target: T;
}


export interface ITgChatRef extends IEntityRef<IEntityMessage, IEntityChat> {

}

export interface ITgUserRef extends IEntityRef<IEntityMessage, IEntityUser> {

}

export interface ITgMessageRef extends IEntityRef<IEntityMessage, IEntityMessage> {

}

export type TTgMessageRefInput = Omit<ITgMessageRef, 'id' | 'source'>
export type TTgChatRefInput = Omit<ITgChatRef, 'id' | 'source'>
export type TTgUserRefInput = Omit<ITgUserRef, 'id' | 'source'>


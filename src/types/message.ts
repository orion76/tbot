import { Chat, Message, User } from 'node-telegram-bot-api';
import { Model } from 'sequelize';

export interface IChat extends Chat {
  data?: any;
}


export interface IUser extends User {
  data?: any;
}


export interface IMessage extends Message {
  id?: string;
  message_id: number;
  deleted?: boolean;
  copied__id?: string;
  
  from__id?: number;
  sender_chat__id?: number;
  chat__id?: number;
  forward_from__id?: number;
  forward_from_chat__id?: number;
  reply_to_message__id?: string;
  thread__id?: string;
  data?: any;

  reply_to_message?: IMessage;
  thread?: IMessage;
  from?: IUser;
  chat: IChat;
  sender_chat?: IChat;
  forward_from?: IUser;
  forward_from_chat?: IChat;
}

export type TMessage = Model<IMessage>;

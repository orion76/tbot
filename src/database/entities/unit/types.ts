import { IEntity, IEntityChat } from '../types';

export interface IEntityUnit extends IEntity {
  description: string;
  chats: IEntityChat[];
}

export interface ITreadPostingConfig {
  answerCount: number;
}

export interface IEntityTreadPosting extends IEntity {
  active: boolean;
  chat: IEntityChat;
  channel: IEntityChat;
  config: ITreadPostingConfig
}


import { TgMessage } from '../database/models/tg-message.model';
import { IMessage } from '../types/message';

export interface ITelegramService {
  saveNewChats(message: TgMessage);

  saveNewUsers(message: TgMessage);

  replaceAssociation(message: TgMessage, fields: (keyof IMessage)[]);

  saveNotSaved(modelClass: any, fields: string[], id_key: string, message: TgMessage);
}

export interface IMessageService {

  save(message: IMessage | TgMessage): Promise<TgMessage>;

  delete(message: TgMessage): Promise<boolean>;

  load(chat_id: number, message_id: number): Promise<TgMessage>;

  loadById(id: string): Promise<TgMessage>;

  loadForwarded(chat_id: number, message_id: number): Promise<TgMessage>;

  countReply(id: string): Promise<number>;

  createThreadTree(root: TgMessage): Promise<ITreeNode>;
}

export interface ITreeNode {
  message: TgMessage;
  children: ITreeNode[];
}

export interface IControlService {
  isGoneCrazy();

}

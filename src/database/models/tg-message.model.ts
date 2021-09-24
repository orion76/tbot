import DataTypes from 'sequelize';
import { BelongsTo, Column, Model, Table } from 'sequelize-typescript';
// import { Model } from 'sequelize';
import { TgChat } from './tg-chat.model';
import { TgUser } from './tg-user.model';
import { IMessage } from '../../types/message';

/**
 *   message: {
    message_id: 75,
    from: {
      id: 1087968824,
      is_bot: true,
      first_name: 'Group',
      username: 'GroupAnonymousBot'
    },
    sender_chat: {
      id: -1001592127748,
      title: 'Freedom-работа Chat',
      type: 'supergroup'
    },
    chat: {
      id: -1001592127748,
      title: 'Freedom-работа Chat',
      type: 'supergroup'
    },
    date: 1631944716,
    text: 'иии'
  }

 */

@Table({
  timestamps: false,
  indexes: [
    {fields: ['date', 'deleted']},
  ]
})
export class TgMessage extends Model<IMessage, IMessage> {
  @Column({type: DataTypes.STRING, primaryKey: true})
  id: string;

  @Column({type: DataTypes.BIGINT({length: 8, unsigned: true})})
  message_id: number;

  @Column({type: DataTypes.TEXT})
  text: string;

  @Column({type: DataTypes.BOOLEAN, defaultValue: 0})
  deleted: boolean;

  @BelongsTo(() => TgUser, 'from__id')
  from: TgUser

  @BelongsTo(() => TgChat, 'chat__id')
  chat: TgChat

  @BelongsTo(() => TgChat, 'sender_chat__id')
  sender_chat: TgChat


  @BelongsTo(() => TgMessage, 'reply_to_message__id')
  reply_to_message: TgMessage

  @BelongsTo(() => TgMessage, 'thread__id')
  thread: TgMessage

  @BelongsTo(() => TgMessage, 'copied__id')
  copied: TgMessage


  @BelongsTo(() => TgUser, 'forward_from__id')
  forward_from: TgUser


  @BelongsTo(() => TgChat, 'forward_from_chat__id')
  forward_from_chat: TgChat

  @Column({type: DataTypes.BIGINT({length: 8, unsigned: true})})
  forward_from_message_id: number;

  @Column({type: DataTypes.BIGINT({length: 8, unsigned: true})})
  date: number;

  get data(): IMessage {
    const data = this.getDataValue('data');
    return data ? JSON.parse(data) : {};
  }

  @Column({
    type: DataTypes.BLOB,
  })
  set data(data: IMessage) {
    this.setDataValue('data', JSON.stringify(data));
  };

  createId() {
    return `${this.getDataValue('chat__id')}${this.getDataValue('message_id')}`
  }

}

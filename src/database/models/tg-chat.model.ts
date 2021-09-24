import DataTypes from 'sequelize';
import { Column, Model, Table } from 'sequelize-typescript';
import { IChat } from '../../types/message';


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
    {fields: ['type']}
  ]
})
export class TgChat extends Model<IChat> {

  @Column({type: DataTypes.BIGINT({ unsigned: false}), primaryKey: true})
  id: number;

  @Column({type: DataTypes.STRING})
  type: string;

  @Column({type: DataTypes.STRING})
  username: string;

  @Column({type: DataTypes.STRING})
  title: string;

  get data(): IChat {
    const data = this.getDataValue('data');
    return data ? JSON.parse(data) : {};
  }

  @Column({
    type: DataTypes.BLOB,
  })
  set data(data: IChat) {
    this.setDataValue('data', JSON.stringify(data));
  };


}

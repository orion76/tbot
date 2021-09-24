import DataTypes from 'sequelize';
import { Column, Model, Table } from 'sequelize-typescript';
import { IUser } from '../../types/message';


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
})
export class TgUser extends Model<IUser> {
  @Column({
    type: DataTypes.BIGINT({length: 8, unsigned: true}),
    primaryKey: true
  })
  id: number;

  @Column({type: DataTypes.BOOLEAN})
  is_bot: boolean;

  @Column({type: DataTypes.STRING})
  first_name: string;


  @Column({type: DataTypes.STRING})
  username: string;

  get data(): IUser {
    const data = this.getDataValue('data');
    return data ? JSON.parse(data) : {};
  }

  @Column({
    type: DataTypes.BLOB,
  })
  set data(data: IUser) {
    this.setDataValue('data', JSON.stringify(data));
  };

  getData() {
    return JSON.parse(this.getDataValue('data'));
  }

  setData(data: any) {
    this.setDataValue('data', JSON.stringify(data));
  }
}

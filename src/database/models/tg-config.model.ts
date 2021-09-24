import DataTypes from 'sequelize';
import { Column, Model, Table } from 'sequelize-typescript';
import { IChat } from '../../types/message';


@Table({
  timestamps: false,
})
export class TgConfig extends Model<IChat> {

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

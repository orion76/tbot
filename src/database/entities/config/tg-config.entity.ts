import { Column, Entity } from 'typeorm';
import { ITgConfig } from '../types';


@Entity()
export class TgConfig implements ITgConfig{

  @Column({unsigned: true, primary: true})
  id: number;

  @Column()
  title: string;


  @Column({type: 'bigint'})
  chat_id: number;


  @Column({type: 'bigint'})
  channel_id: number;

  @Column({type: 'longtext'})
  config: string;


}

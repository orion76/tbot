import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IEntityChat } from '../types';
import { IEntityUnit } from './types';
import { TgEntity } from '../../tg-entity';


@Entity()
export class Unit extends TgEntity<IEntityUnit> implements IEntityUnit {
  @PrimaryGeneratedColumn({type: 'integer', unsigned: true})
  id: number;
  
  chats: IEntityChat[];

  @Column({type:'text'})
  description: string;
}

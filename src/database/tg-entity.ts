import { Column } from 'typeorm';
import { IEntity } from './entities/types';

export class TgEntity<T> implements IEntity {

  @Column()
  title: string;

  @Column({default: false})
  deleted: boolean;
  
}

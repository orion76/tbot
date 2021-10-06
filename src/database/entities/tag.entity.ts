import { Column, Entity, Index, PrimaryGeneratedColumn, Tree, TreeChildren, TreeParent } from 'typeorm';
import { IEntityTag } from './types';


@Entity()
@Tree('closure-table')
@Index(['title'], {unique: true})
export class Tag implements IEntityTag {
  @PrimaryGeneratedColumn({type: 'bigint'})
  id: number;

  @Column()
  title: string;

  @Column({length: 512, default: ''})
  description: string;

  @TreeChildren()
  children: IEntityTag[];

  @TreeParent()
  parent: IEntityTag;
}

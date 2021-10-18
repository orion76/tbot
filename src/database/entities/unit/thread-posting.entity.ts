import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TgEntity } from '../../tg-entity';
import { IEntityTreadPosting, ITreadPostingConfig } from './types';
import { IEntityChat } from '../types';
import { TgUser } from '../tg-user.entity';
import { TgChat } from '../tg-chat.entity';


@Entity()
export class TreadPosting extends TgEntity<IEntityTreadPosting> implements IEntityTreadPosting {
  @PrimaryGeneratedColumn({type: 'integer', unsigned: true})
  id: number;
  
  @Column({type:'boolean'})
  active: boolean;

  @ManyToOne(
    () => TgChat,
    {cascade: ['insert', 'update']}
  )
  channel: IEntityChat;

  @ManyToOne(
    () => TgChat,
    {cascade: ['insert', 'update']}
  )
  chat: IEntityChat;

  @Column({type:'blob'})
  config: ITreadPostingConfig;

}

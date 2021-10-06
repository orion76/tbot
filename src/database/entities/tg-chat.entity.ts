import { BeforeInsert, Column, Entity, Index, OneToMany } from 'typeorm';
import { TgEntity } from '../tg-entity';
import { ChatType } from 'node-telegram-bot-api';
import { IEntityChat, IEntityMessage } from './types';
import { TgMessage } from './tg-message.entity';


@Entity()
@Index(['type'])
@Index(['username'])
export class TgChat extends TgEntity<IEntityChat> implements IEntityChat {

  @Column({primary: true})
  id: string;

  @Column()
  type: ChatType;

  @Column()
  username: string;

  @OneToMany(
    () => TgMessage,
    (message) => message.chat
  )
  messages: IEntityMessage[]

  @BeforeInsert()
  setTitle() {
    this.title = this.username ? this.username : String(this.id);
  }
}

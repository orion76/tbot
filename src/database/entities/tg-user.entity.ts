import { BeforeInsert, Column, Entity, Index, OneToMany } from 'typeorm';
import { TgEntity } from '../tg-entity';
import { IEntityMessage, IEntityUser } from './types';
import { TgMessage } from './tg-message.entity';


@Entity()
@Index(['is_bot'])
@Index(['username'])
@Index(['first_name'])
export class TgUser extends TgEntity<IEntityUser> implements IEntityUser {

  @Column({primary: true})
  id: string;

  @Column({default: false})
  is_bot: boolean;

  @Column({nullable: true})
  first_name: string;

  @Column({nullable: true})
  username: string;

  @OneToMany(
    () => TgMessage,
    (message) => message.from
  )
  messages: IEntityMessage[]


  @BeforeInsert()
  setTitle() {
    this.title = this.username ? this.username : this.first_name;
  }

}

import { TgEntity } from '../tg-entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Tag } from './tag.entity';
import { MessageType } from './message-type.entity';
import { IEntityChat, IEntityMessage, IEntityUser, IEntityTag } from './types';
import { TgChat } from './tg-chat.entity';
import { TgUser } from './tg-user.entity';


@Entity()
@Index(['date'])
// @Index(['message_id', 'chatId'], {unique: true})
export class TgMessage extends TgEntity<IEntityMessage> implements IEntityMessage {

  @PrimaryGeneratedColumn({type: 'bigint', unsigned: true})
  id: number;

  @Column({type: 'bigint', unsigned: true})
  message_id: number;

  @Column()
  chatId: string;

  @Column()
  fromId: string;


  @Column()
  date: number

  @Column({type:'longtext'})
  text: string;

  @ManyToMany(() => Tag)
  @JoinTable()
  tags: IEntityTag[]

  @ManyToMany(() => MessageType)
  @JoinTable()
  type: MessageType[]

  @ManyToOne(
    () => TgChat,
    {cascade: ['insert', 'update']}
  )
  @JoinTable()
  chat: IEntityChat;

  @ManyToOne(
    () => TgUser,
    {cascade: ['insert', 'update']}
  )
  from: IEntityUser;


  @ManyToOne(() => TgUser,
    {
      cascade: ['insert', 'update'],
      nullable: true,
    })
  forward_from: IEntityUser;

  @ManyToOne(() => TgChat, 
    {
    cascade: ['insert', 'update'],
    nullable: true,
  })
  sender_chat: IEntityChat;

  @ManyToOne(() => TgChat,
    {
      cascade: ['insert', 'update'],
      nullable: true,
    })
  forward_from_chat: IEntityChat;

  @ManyToOne(() => TgMessage,
    {
      cascade: ['insert', 'update'],
      nullable: true,
    })
  thread: IEntityMessage;

  @ManyToOne(() => TgMessage,
    {
      nullable: true,
    })
  reply_to_message: IEntityMessage;

  @ManyToOne(() => TgMessage,
    {
      cascade: ['insert', 'update'],
      nullable: true,
    })
  forward_from_message: IEntityMessage;


  getChats(): IEntityChat[] {
    return []
  }

  getMessages(): IEntityMessage[] {
    return [];
  }

  getUsers(): IEntityUser[] {
    return []
  }

  @BeforeInsert()
  setTitle() {
    this.title = this.text ? this.text.substring(0, 200) : 'empty';
  }


}

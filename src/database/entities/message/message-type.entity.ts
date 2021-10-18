import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';


@Entity()
export class MessageType {
  @PrimaryGeneratedColumn({type: 'bigint', unsigned: true})
  id: number;
  
  @Column()
  title: string;

  @Column({type:'text'})
  description: string;

}

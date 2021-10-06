import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';


@Entity()
export class MessageType {
  @PrimaryGeneratedColumn({type: 'bigint', unsigned: true})
  id: number;
  
  @Column()
  title: string;

  @Column({length: 512, default: ''})
  description: string;

}

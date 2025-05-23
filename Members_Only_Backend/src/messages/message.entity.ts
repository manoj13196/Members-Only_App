/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, } from 'typeorm';
import { Users } from '../Users_Module/entities/user.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

 @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
timestamp: Date;

 
  @ManyToOne(() => Users, user => user.messages, { eager: true })
  author: Users;
}

/* eslint-disable prettier/prettier */
import { Message } from "src/messages/message.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()

export class Users{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({unique:true})
    email:string;

    @Column()
    password:string;

    @Column({ default: false })
    isMember: boolean;

    @Column({ default: false })
    isAdmin: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => Message, message => message.author)
messages: Message[];

}
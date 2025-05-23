/* eslint-disable prettier/prettier */
import { Module } from "@nestjs/common";
import { MessageController } from "./message.controller";
import { MessageService } from "./message.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Message } from "./message.entity";
import { Users } from "src/Users_Module/entities/user.entity";

@Module({
    imports:[TypeOrmModule.forFeature([Users,Message])],
      controllers: [MessageController],
      providers: [MessageService],
})
export class MessageModule{}
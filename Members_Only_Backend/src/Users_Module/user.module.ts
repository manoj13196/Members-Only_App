/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';
import { Message } from 'src/messages/message.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Users,Message])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
 
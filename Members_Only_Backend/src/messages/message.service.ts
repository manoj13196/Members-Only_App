/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Message } from './message.entity';
import { CreateMessageDto } from './dto/create_message_dto';
import { Users } from '../Users_Module/entities/user.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,

    @InjectRepository(Users)
  private readonly userRepository: Repository<Users>,
  ) {}

  async createMessage(createMessageDto: CreateMessageDto, partialUser: any): Promise<Message> {
    const { title, content } = createMessageDto;

   const user = await this.userRepository.findOneBy({ id: partialUser.id });

  if (!user) {
    throw new Error('User not found');
  }
    const message = this.messageRepository.create({
      title,
      content,
      author: user, 
    });

    return await this.messageRepository.save(message);
  }


  async getAllMessages(): Promise<Message[]> {
  return await this.messageRepository.find({
    order: { timestamp: 'DESC' },
  });
}


async deleteMessage(id: number): Promise<void> {
  const result = await this.messageRepository.delete(id);

  if (result.affected === 0) {
    throw new NotFoundException('Message not found');
  }
}


}

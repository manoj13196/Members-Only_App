/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Delete,
  Param,
} from '@nestjs/common';
// import { JwtStrategy } from '../auth/strategy/jwt.strategy';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create_message_dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/validations/roles.decorator';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createMessage(
    @Body() createMessageDto: CreateMessageDto,
    @Request() req,
  ) {
    console.log('req.user:', req.user);
    const user = req.user; 

    const message = await this.messageService.createMessage(
      createMessageDto,
      user,
    );

    return {
      message: 'Message posted successfully',
      data: message,
    };
  }

@UseGuards(JwtAuthGuard)
@Get()
async getMessages(@Request() req) {
  const isMember = req.user.isMember;

  const messages = await this.messageService.getAllMessages();
  const formattedMessages = messages.map(msg => {
    const { author, ...rest } = msg;

    return isMember
      ? msg
      : {
          ...rest,
          author: {
            firstName: 'Anonymous',
            lastName: '',
          },
        };
  });

  return formattedMessages;
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Delete(':id')
async deleteMessage(@Param('id') id: number) {
  await this.messageService.deleteMessage(id);
  return { message: 'Message deleted successfully' };

  
}
}

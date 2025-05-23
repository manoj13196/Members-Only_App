/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Users } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './Dto/create.user.dto';
import { UpdateUserDto } from './Dto/update.user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private userRepository:Repository<Users>,
  ){}

  findAll() {
    return this.userRepository.find();
  }

  findOne(id:number){
    return this.userRepository.findOne({where : {id}});
  }

  create(createUserDto:CreateUserDto) {
    const user=this.userRepository.create(createUserDto)
    return this.userRepository.save(user);
  }


  async update(id:number, dto:UpdateUserDto){
    await this.userRepository.update(id,dto);
    return this.findOne(id);
   
  }

  async delete(id:number){
    await this.userRepository.delete(id);
    return {message:`User ${id} deleted`};
 
  }
}

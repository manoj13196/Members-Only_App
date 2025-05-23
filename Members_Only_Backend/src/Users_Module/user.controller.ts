/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserDto } from './Dto/create.user.dto';
import { UpdateUserDto } from './Dto/update.user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Req()req:any){
    return req.user;
  }

   
  @Post()
  async createUser(@Body() createUserDto:CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  async getAllUsers() {
    return await this.usersService.findAll();
  }

  @Get(':id')
  async getUserById(@Param('id',ParseIntPipe) id:number){
    const user= await this.usersService.findOne(id);

    if(!user){
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  @Put(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id:number,
    @Body() updateUserDto:UpdateUserDto
  ){
    const updated=await this.usersService.update(id,updateUserDto);
    if(!updated) throw new NotFoundException(`User with Id ${id} not found`)
    return updated;
  }


  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe)id:number){
    const success= await this.usersService.delete(id);
    if(!success) throw new NotFoundException(`User with ID ${id} not found`);
    return {message:`User with ID ${id} deleted successfully`}
  }
}

/* eslint-disable prettier/prettier */
import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class CreateUserDto{
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    name:string;

    @IsEmail()
    email:string;

    @IsOptional()
    @IsInt()
    age?:number;
}
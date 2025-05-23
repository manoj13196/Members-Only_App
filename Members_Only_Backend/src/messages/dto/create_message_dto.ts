/* eslint-disable prettier/prettier */
import { IsString, MinLength, MaxLength } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  title: string;

  @IsString()
  @MinLength(5)
  @MaxLength(1000)
  content: string;
}

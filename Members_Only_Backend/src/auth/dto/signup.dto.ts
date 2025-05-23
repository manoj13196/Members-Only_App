/* eslint-disable prettier/prettier */
import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";
import { Match } from "src/common/validations/match.decorator";

export class SignupDto{
    @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsString()
  @Match('password', { message: 'Passwords do not match' })
  confirmPassword: string;

  @IsOptional()
@IsString()
adminPasscode?: string;
  
}
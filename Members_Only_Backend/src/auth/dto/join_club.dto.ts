/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsString } from 'class-validator';

export class JoinClubDto {
  @IsString()
  secretCode: string;
}

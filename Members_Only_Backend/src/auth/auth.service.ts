/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/Users_Module/entities/user.entity';
import { Repository } from 'typeorm';
import { SignupDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private userRepo: Repository<Users>, // corrected name
    private jwt: JwtService,
    private configService: ConfigService,
  ) {}

  async signup(dto: SignupDto) {
    const existing = await this.userRepo.findOne({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException(`Email is already in use`);
    }

    const hashed = await bcrypt.hash(dto.password, 10);

    // Check for admin passcode
    const adminSecret = this.configService.get('ADMIN_PASS');
    const isAdmin = dto.adminPasscode === adminSecret;

    const user = this.userRepo.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      password: hashed,
      isMember: false,
      isAdmin: isAdmin,
    });

    const saved = await this.userRepo.save(user);

    const { password, ...safe } = saved;
    return safe;
  }

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid password');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      isMember: user.isMember,
      isAdmin: user.isAdmin,
    };

    const token = await this.jwt.signAsync(payload);

    return { access_token: token };
  }

  async joinClub(userId: number, secretCode: string): Promise<string> {
    const secretPasscode =
      this.configService.get('CLUB_PASSCODE') || 'openSesame';

    if (secretCode !== secretPasscode) {
      throw new UnauthorizedException('Invalid passcode');
    }

    const user = await this.userRepo.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.isMember = true;

    await this.userRepo.save(user);

    return 'You are now a club member!';
  }

  
}

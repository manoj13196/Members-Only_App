/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { Body, Controller, Post, UseGuards, Request } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignupDto } from "./dto/signup.dto";
import { LoginDto } from "./dto/login.dto";
import { AuthGuard } from "@nestjs/passport";
import { JoinClubDto } from "./dto/join_club.dto";
// import { JwtAuthGuard } from "./guards/jwt-auth.guard";

@Controller('auth')
export class AuthController{

    constructor(private readonly authService:AuthService){}

    @Post('signup')
    signup(@Body() dto:SignupDto){
        return this.authService.signup(dto);
    }

    @Post('login')
    login(@Body() dto:LoginDto){
        return this.authService.login(dto)
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('join')
    async joinClub(@Body() joinClubDto:JoinClubDto, @Request() req){
        const userId=req.user.id;
        const result=await this.authService.joinClub(userId, joinClubDto.secretCode);
        return {message:result};
    }

}
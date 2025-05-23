/* eslint-disable prettier/prettier */
import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Users } from "src/Users_Module/entities/user.entity";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./strategy/jwt.strategy";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";

@Module({
    imports:[TypeOrmModule.forFeature([Users]),
            JwtModule.register({
                global:true,
                secret:'supersecretkey',
                signOptions:{expiresIn:'1d'},
            })],
    controllers:[AuthController],
    providers:[AuthService, JwtStrategy,JwtAuthGuard ],
   
})

export class AuthModule {}
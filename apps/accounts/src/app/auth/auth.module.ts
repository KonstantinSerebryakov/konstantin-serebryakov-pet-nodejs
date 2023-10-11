import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { getJWTConfig } from '../configs/jwt.config';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
	imports: [UsersModule, JwtModule.registerAsync(getJWTConfig())],
	controllers: [AuthController],
	providers: [AuthService],
})
export class AuthModule {}

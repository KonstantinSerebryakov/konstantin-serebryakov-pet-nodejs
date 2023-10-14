import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ScheduleModule } from '@nestjs/schedule';
import { RMQModule } from 'nestjs-rmq';
import { getJWTConfig } from './configs/jwt.config';
import { getRMQConfig } from './configs/rmq.config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AuthController } from './controllers/auth.controller';
import { UsersController } from './controllers/users.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ApiService } from './services/api.service';
import { ProfilesController } from './controllers/profiles.controller';
import { ProfilesNestedController } from './controllers/profiles-nested.controller';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'assets/client'),
      renderPath: '/',
    }),
    ConfigModule.forRoot({ envFilePath: 'envs/.api.env', isGlobal: true }),
    RMQModule.forRootAsync(getRMQConfig()),
    JwtModule.registerAsync(getJWTConfig()),
    PassportModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [
    AuthController,
    UsersController,
    ProfilesController,
    ProfilesNestedController,
  ],
  providers: [JwtStrategy, ApiService],
})
export class AppModule {}

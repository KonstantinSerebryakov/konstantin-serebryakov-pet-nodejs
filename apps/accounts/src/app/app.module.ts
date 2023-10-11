import { RMQModule } from 'nestjs-rmq';
import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
// import { ConfigModule } from '@nestjs/config';
import { getRMQConfig } from './configs/rmq.config';

@Module({
	imports: [
		// ConfigModule.forRoot({ isGlobal: true, envFilePath: 'envs/.account.env' }),
		RMQModule.forRootAsync(getRMQConfig()),
		UsersModule,
		AuthModule,
	],
})
export class AppModule {}

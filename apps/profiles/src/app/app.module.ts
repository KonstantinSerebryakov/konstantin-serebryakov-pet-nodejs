import { RMQModule } from 'nestjs-rmq';
import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { getRMQConfig } from './configs/rmq.config';
import { ProfilesRepository } from './repositories/profiles.repository';
import { ProfileService } from './services/porfiles.service';
import { ProfilesCommands } from './controllers/profiles.commands';
import { ProfilesQueries } from './controllers/profiles.queries';
import { PrismaModule } from '../prisma/prisma.module';
import { ProfilesEvents } from './controllers/profiles.events';
import { HttpModule } from '@nestjs/axios';
import { IconsService } from './services/icons8.service';
import { ProfilesNestedCommands } from './controllers/profiles-nested.commands';

@Module({
	imports: [
    HttpModule,
		ConfigModule.forRoot({ isGlobal: true, envFilePath: 'envs/.profile.env' }),
		RMQModule.forRootAsync(getRMQConfig()),
    PrismaModule
	],
  controllers: [ProfilesCommands, ProfilesNestedCommands, ProfilesQueries, ProfilesEvents],
	providers: [ProfilesRepository, ProfileService, IconsService],
})
export class AppModule {
}

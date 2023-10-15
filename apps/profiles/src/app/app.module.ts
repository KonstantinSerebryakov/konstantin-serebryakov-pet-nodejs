import { RMQModule } from 'nestjs-rmq';
import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { getRMQConfig } from './configs/rmq.config';
import { ProfilesRepository } from './repositories/profiles.repository';
import { ProfileService } from './services/porfiles.service';
import { ProfilesCommands } from './controllers/profiles.commands';
import { ProfilesQueries } from './controllers/profiles.queries';
import { ProfilesEvents } from './controllers/profiles.events';
import { HttpModule } from '@nestjs/axios';
import { IconsService } from './services/icons8.service';
import { ProfilesNestedCommands } from './controllers/profiles-nested.commands';
import { PrismaClientProfilesModule } from '@konstantin-serebryakov-pet-nodejs/prisma-client-profiles';

@Module({
  imports: [
    RMQModule.forRootAsync(getRMQConfig()),
    HttpModule,
    PrismaClientProfilesModule,
  ],
  controllers: [
    ProfilesCommands,
    ProfilesNestedCommands,
    ProfilesQueries,
    ProfilesEvents,
  ],
  providers: [ProfilesRepository, ProfileService, IconsService],
})
export class AppModule {}

import { RMQModule } from 'nestjs-rmq';
import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { getRMQConfig } from './configs/rmq.config';
import { ProfilesService } from './services/porfiles.service';
import { ProfilesCommands } from './controllers/profiles.commands';
import { ProfilesQueries } from './controllers/profiles.queries';
import { ProfilesEvents } from './controllers/profiles.events';
import { HttpModule } from '@nestjs/axios';
import { IconsService } from './services/icons8.service';
import { ProfilesNestedCommands } from './controllers/profiles-nested.commands';
import { PrismaClientProfilesModule } from '@konstantin-serebryakov-pet-nodejs/prisma-client-profiles';
import { ProfileRepository } from './repositories/profile.repository';
import { CredentialRepository } from './repositories/credential.repository';
import { SocialMediasRepository } from './repositories/social-medias.repository';

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
  providers: [
    ProfileRepository,
    CredentialRepository,
    SocialMediasRepository,
    ProfilesService,
    IconsService,
  ],
})
export class AppModule {}

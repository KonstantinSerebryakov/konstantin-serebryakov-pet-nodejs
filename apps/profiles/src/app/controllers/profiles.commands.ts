import { Body, Controller, UnauthorizedException } from '@nestjs/common';
import { RMQValidate, RMQRoute } from 'nestjs-rmq';
import {
  ProfileChange,
  ProfileChangeCredentialDefault,
  ProfileChangeDefault,
  ProfileCreateOne,
  ProfileDeleteOne,
  ProfileQueryDefault,
} from '@konstantin-serebryakov-pet-nodejs/contracts';
import { ProfilesService } from '../services/porfiles.service';
import { ProfileEntity } from '../entities/profile.entity';
import { CredentialEntity } from '../entities/credential.entity';
import { ProfileRepository } from '../repositories/profile.repository';

@Controller()
export class ProfilesCommands {
  constructor(
    private readonly profileService: ProfilesService,
    private readonly profileRepository: ProfileRepository) {}

  @RMQValidate()
  @RMQRoute(ProfileCreateOne.topic)
  async createProfile(
    @Body() { userId }: ProfileCreateOne.Request
  ): Promise<ProfileCreateOne.Response> {
    return this.profileService.createProfile(userId);
  }

  @RMQValidate()
  @RMQRoute(ProfileChange.topic)
  async changeProfile(
    @Body() { userId, profileId, profile }: ProfileChange.Request
  ): Promise<ProfileChange.Response> {
    const isEditPermitted =
      await this.profileService.validateProfileEditPermission(
        userId,
        profileId
      );
    if (!isEditPermitted) throw new UnauthorizedException();

    const profileEntity = new ProfileEntity(profile);
    profileEntity.userId = userId;
    return this.profileService.updateProfile(profileId, profileEntity);
  }

  @RMQValidate()
  @RMQRoute(ProfileChangeDefault.topic)
  async changeProfileDefault(
    @Body() { userId, profile }: ProfileChangeDefault.Request
  ): Promise<ProfileChangeDefault.Response> {
    const profileId = await this.profileService.getDefaultProfileId(userId);
    const profileEntity = new ProfileEntity(profile);
    profileEntity.userId = userId;
    return this.profileService.updateProfile(profileId, profileEntity);
  }


  @RMQValidate()
  @RMQRoute(ProfileDeleteOne.topic)
  async deleteProfile(
    @Body() { userId, profileId }: ProfileDeleteOne.Request
  ): Promise<ProfileDeleteOne.Response> {
    const isEditPermitted =
      await this.profileService.validateProfileEditPermission(
        userId,
        profileId
      );
    if (!isEditPermitted) throw new UnauthorizedException();

    return this.profileRepository.deleteProfileById(profileId);
  }
}

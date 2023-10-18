import { Body, Controller } from '@nestjs/common';
import { RMQValidate, RMQRoute } from 'nestjs-rmq';
import {
  ProfileQuery,
  ProfileQueryDefault,
  ProfileQueryUserProfilesIds,
  ProfileQueryUserProfilesList,
} from '@konstantin-serebryakov-pet-nodejs/contracts';
import { ProfilesService } from '../services/porfiles.service';
import { ProfileRepository } from '../repositories/profile.repository';

// query default
// query
// query profiles IDS

@Controller()
export class ProfilesQueries {
  constructor(
    private readonly profileRepository: ProfileRepository,
    private readonly profileService: ProfilesService
  ) {}

  @RMQValidate()
  @RMQRoute(ProfileQueryDefault.topic)
  async getProfileDefault(
    @Body() { userId }: ProfileQueryDefault.Request
  ): Promise<ProfileQueryDefault.Response> {
    const profileEntity = await this.profileRepository.findProfileDefaultNested(
      userId
    );
    return {
      profile: profileEntity,
    };
  }

  @RMQValidate()
  @RMQRoute(ProfileQuery.topic)
  async getProfile(
    @Body() { userId, profileId }: ProfileQuery.Request
  ): Promise<ProfileQuery.Response> {
    await this.profileService.validateProfileQueryPermission(profileId, userId);
    const profileEntity = await this.profileRepository.findProfileNestedById(
      profileId
    );
    return {
      profile: profileEntity,
    };
  }

  @RMQValidate()
  @RMQRoute(ProfileQueryUserProfilesIds.topic)
  async getProfilesIdsForUser(
    @Body() { userId }: ProfileQueryUserProfilesIds.Request
  ): Promise<ProfileQueryUserProfilesIds.Response> {
    const ids = await this.profileRepository.findManyProfileIdsByUserId(userId);
    return {
      profileIds: ids,
    }
  }

  @RMQValidate()
  @RMQRoute(ProfileQueryUserProfilesList.topic)
  async getProfilesListForUser(
    @Body() { userId }: ProfileQueryUserProfilesList.Request
  ): Promise<ProfileQueryUserProfilesList.Response> {
    const profiles = await this.profileRepository.findManyProfileWithEssentialListByUserId(userId);
    return {
      profiles: profiles,
    }
  }
}

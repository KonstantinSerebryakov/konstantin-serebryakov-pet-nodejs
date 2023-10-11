import { Body, Controller, UnauthorizedException } from '@nestjs/common';
import { RMQValidate, RMQRoute } from 'nestjs-rmq';
import { ProfileService } from '../services/porfiles.service';
import { ProfileEntity } from '../entities/profile.entity';
import { CredentialEntity } from '../entities/credential.entity';
import {
  ProfileChangeCredential,
  ProfileChangeCredentialDefault,
  ProfileChangeSocialMediaNodes,
  ProfileChangeSocialMediaNodesDefault,
} from '@konstantin-serebryakov-pet-nodejs/contracts';
import { SocialMediaNodeEntity } from '../entities/socialMediaNode.entity';

@Controller()
export class ProfilesNestedCommands {
  constructor(private readonly profileService: ProfileService) {}

  @RMQValidate()
  @RMQRoute(ProfileChangeCredential.topic)
  async changeCredential(
    @Body() { profileId, userId, credential }: ProfileChangeCredential.Request
  ): Promise<ProfileChangeCredential.Response> {
    const isEditPermitted =
      await this.profileService.validateProfileEditPermission(
        userId,
        profileId
      );
    if (!isEditPermitted) throw new UnauthorizedException();

    const credentialEntity = new CredentialEntity(credential);
    return this.profileService.updateCredential(profileId, credentialEntity);
  }

  @RMQValidate()
  @RMQRoute(ProfileChangeCredentialDefault.topic)
  async changeCredentialDefault(
    @Body() { userId, credential }: ProfileChangeCredentialDefault.Request
  ): Promise<ProfileChangeCredentialDefault.Response> {
    const profileId = await this.profileService.getDefaultProfileId(userId);
    const credentialEntity = new CredentialEntity(credential);
    return this.profileService.updateCredential(profileId, credentialEntity);
  }

  @RMQValidate()
  @RMQRoute(ProfileChangeSocialMediaNodes.topic)
  async changeSocialMediaNodes(
    @Body()
    {
      profileId,
      userId,
      socialMediaNodes,
    }: ProfileChangeSocialMediaNodes.Request
  ): Promise<ProfileChangeSocialMediaNodes.Response> {
    const isEditPermitted =
      await this.profileService.validateProfileEditPermission(
        userId,
        profileId
      );
    if (!isEditPermitted) throw new UnauthorizedException();

    const socialMediaNodesEntities = socialMediaNodes.map(
      (node) => new SocialMediaNodeEntity(node)
    );
    return this.profileService.updateSocialMediaNodes(profileId, socialMediaNodesEntities);
  }

  @RMQValidate()
  @RMQRoute(ProfileChangeSocialMediaNodesDefault.topic)
  async changeSocialMediaNodesDefault(
    @Body() { userId, socialMediaNodes }: ProfileChangeSocialMediaNodesDefault.Request
  ): Promise<ProfileChangeSocialMediaNodesDefault.Response> {
    const profileId = await this.profileService.getDefaultProfileId(userId);
    const socialMediaNodesEntities = socialMediaNodes.map(
      (node) => new SocialMediaNodeEntity(node)
    );
    return this.profileService.updateSocialMediaNodes(profileId, socialMediaNodesEntities);
  }
}

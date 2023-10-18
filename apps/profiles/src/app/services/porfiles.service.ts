import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SocialMediaVariantEntity } from '../entities/socialMediaVariant.entity';
import { SocialMediaNodeEntity } from '../entities/socialMediaNode.entity';
import { CredentialEntity } from '../entities/credential.entity';
import { ProfileEntity } from '../entities/profile.entity';
import {
  extractSocialMediaVariants,
  extractSocialMediaVariantsNames,
} from '../entities/entities.utility';
import { ProfileRepository } from '../repositories/profile.repository';
import { CredentialRepository } from '../repositories/credential.repository';
import { SocialMediasRepository } from '../repositories/social-medias.repository';

@Injectable()
export class ProfilesService {
  constructor(
    private readonly profileRepository: ProfileRepository,
    private readonly credentialRepository: CredentialRepository,
    private readonly socialMediasRepository: SocialMediasRepository
  ) {}

  async generateProfileDefault(userId: string) {
    return this.profileRepository.generateProfileDefault(userId);
  }

  async createProfile(userId: string) {
    return this.profileRepository.createProfile(userId);
  }

  async updateProfile(profileId: string, profile: ProfileEntity) {
    if (profile.socialMediaNodes) {
      await this.updateSocialMediaNodes(profileId, profile.socialMediaNodes);
    }
    if (profile.credential) {
      await this.updateCredential(profileId, profile.credential);
    }
    const profileUpdateResult = await this.profileRepository.updateProfileSelf(
      profileId,
      profile
    );
    return profileUpdateResult;
  }

  async updateCredential(profileId: string, credential: CredentialEntity) {
    return this.credentialRepository.updateCredentialByProfileId(
      profileId,
      credential
    );
  }

  async synchronizeSocialMediaNodesVariantsWithDatabase(
    socialMediaNodes: SocialMediaNodeEntity[]
  ) {
    const variantNames = await extractSocialMediaVariantsNames(
      socialMediaNodes
    );
    const storedVariants =
      await this.socialMediasRepository.findExistedSocialMediaVariantsByNames(
        variantNames
      );
    socialMediaNodes.forEach((node) => {
      const storedVariant = storedVariants.find(
        (variant) => variant.name === node.socialMediaVariant.name
      );
      if (!storedVariant) throw new Error('socialMediaVariant not found');
      node.socialMediaVariant = storedVariant;
    });
  }

  async updateSocialMediaNodes(
    profileId: string,
    socialMediaNodes: SocialMediaNodeEntity[]
  ) {
    const variants = await extractSocialMediaVariants(socialMediaNodes);
    await this.appendSocialMediasVariants(variants);
    await this.synchronizeSocialMediaNodesVariantsWithDatabase(
      socialMediaNodes
    );

    return this.socialMediasRepository.updateSocialMedias(
      profileId,
      socialMediaNodes
    );
  }

  async appendSocialMediasVariants(variants: SocialMediaVariantEntity[]) {
    const names = variants.map((variant) => variant.name);
    const existedNames =
      await this.socialMediasRepository.findExistedSocialMediaVariantNamesByNames(
        names
      );
    const notExisted = variants.filter(
      (variant) => !existedNames.includes(variant.name)
    );
    // TODO: uncomment
    // await this.iconsService.fillSocialMediaVariantIcons(notExisted);
    return this.socialMediasRepository.createSocialMediaVariants(notExisted);
  }

  //
  // UTILITY
  //

  async isProfilePublic(profileId: string) {
    return this.profileRepository.isProfilePublic(profileId);
  }

  async validateProfileQueryPermission(profileId: string, userId: string) {
    const isPublic = await this.isProfilePublic(profileId);
    if (isPublic) return true;

    const isUserAllowed = await this.validateProfileEditPermission(
      userId,
      profileId
    );
    if (isUserAllowed) return true;

    throw new UnauthorizedException();
  }

  async validateProfileEditPermission(userId: string, profileId: string) {
    const profile = await this.profileRepository.findProfileNestedById(
      profileId
    );
    if (profile.userId !== userId) throw new UnauthorizedException();
    return true;
  }

  async getDefaultProfileId(userId: string) {
    return this.profileRepository.findProfileDefaultId(userId);
  }
}

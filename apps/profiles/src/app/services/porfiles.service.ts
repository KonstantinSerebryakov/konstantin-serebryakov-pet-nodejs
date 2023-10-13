import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RMQService } from 'nestjs-rmq';
import { ProfilesRepository } from '../repositories/profiles.repository';
import { IProfile } from '@konstantin-serebryakov-pet-nodejs/interfaces';
import { SocialMediaVariantEntity } from '../entities/socialMediaVariant.entity';
import { HttpService } from '@nestjs/axios';
import { IconsService } from './icons8.service';
import { SocialMediaNodeEntity } from '../entities/socialMediaNode.entity';
import { CredentialEntity } from '../entities/credential.entity';
import { ProfileEntity } from '../entities/profile.entity';
import {
  extractSocialMediaVariants,
  extractSocialMediaVariantsNames,
} from '../entities/entities.utility';
// import { IProfileDefaults } from '@konstantin-serebryakov-pet-nodejs/interfaces';

@Injectable()
export class ProfileService {
  constructor(private readonly profilesRepository: ProfilesRepository) {}

  async generateProfileDefault(userId: string) {
    return this.profilesRepository.generateProfileDefault(userId);
  }

  async createProfile(userId: string) {
    return this.profilesRepository.createProfile(userId);
  }

  async updateProfile(profileId: string, profile: ProfileEntity) {
    if (profile.socialMediaNodes) {
      await this.updateSocialMediaNodes(profileId, profile.socialMediaNodes);
    }
    if (profile.credential) {
      await this.updateCredential(profileId, profile.credential);
    }
    const profileUpdateResult = await this.profilesRepository.updateProfileSelf(
      profileId,
      profile
    );
    return profileUpdateResult;
  }

  async updateCredential(profileId: string, credential: CredentialEntity) {
    return this.profilesRepository.updateCredentialByProfileId(
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
      await this.profilesRepository.findExistedSocialMediaVariantsByNames(
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

    return this.profilesRepository.updateSocialMedias(
      profileId,
      socialMediaNodes
    );
  }

  async appendSocialMediasVariants(variants: SocialMediaVariantEntity[]) {
    const names = variants.map((variant) => variant.name);
    const existedNames =
      await this.profilesRepository.findExistedSocialMediaVariantNamesByNames(
        names
      );
    const notExisted = variants.filter(
      (variant) => !existedNames.includes(variant.name)
    );
    // TODO: uncomment
    // await this.iconsService.fillSocialMediaVariantIcons(notExisted);
    return this.profilesRepository.createSocialMediaVariants(notExisted);
  }

  //
  // UTILITY
  //

  async isProfilePublic(profileId: string) {
    return this.profilesRepository.isProfilePublic(profileId);
  }

  async validateProfileQueryPermission(profileId: string, userId: string) {
    const isPublic = await this.isProfilePublic(profileId);
    if (isPublic) return true;

    const isUserAllowed = await this.validateProfileEditPermission(userId, profileId);
    if (isUserAllowed) return true;

    throw new UnauthorizedException();
  }

  async validateProfileEditPermission(userId: string, profileId: string) {
    const profile = await this.profilesRepository.findProfileNestedById(
      profileId
    );
    if (profile.userId !== userId) throw new UnauthorizedException();
    return true;
  }

  async getDefaultProfileId(userId: string) {
    return this.profilesRepository.findProfileDefaultId(userId);
  }
}

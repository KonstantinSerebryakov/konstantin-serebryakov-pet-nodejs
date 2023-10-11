import {
  ICredential,
  ISocialMediaNode,
  ISocialMediaVariant,
  ISocialMedias,
} from '@konstantin-serebryakov-pet-nodejs/interfaces';
import { SocialMediaVariantEntity } from './socialMediaVariant.entity';

export class SocialMediaNodeEntity implements ISocialMediaNode {
  id?: string;
  profileId?: string;
  socialMediaVariant: SocialMediaVariantEntity;
  isActive: boolean;
  link: string;

  constructor(socialMedia: ISocialMediaNode) {
    this.id = socialMedia.id;
    this.profileId = socialMedia.profileId;
    this.socialMediaVariant = new SocialMediaVariantEntity(
      socialMedia.socialMediaVariant
    );
    this.isActive = socialMedia.isActive;
    this.link = socialMedia.link;
  }

  public getPublicSelf(): Omit<
    ISocialMediaNode,
    'id' | 'profileId' | 'socialMediaVariant'
  > {
    return {
      isActive: this.isActive,
      link: this.link,
    };
  }

  public getPublicNested(): Omit<ISocialMediaNode, 'id' | 'profileId'> {
    return {
      socialMediaVariant: this.socialMediaVariant.getPublic(),
      isActive: this.isActive,
      link: this.link,
    };
  }
}

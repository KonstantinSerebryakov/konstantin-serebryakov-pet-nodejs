import {
  ICredential,
  ISocialMediaVariant,
} from '@konstantin-serebryakov-pet-nodejs/interfaces';

export class SocialMediaVariantEntity implements ISocialMediaVariant {
  id?: number;
  iconUrl: string | null;
  name: string;

  constructor(socialMediaVariant: ISocialMediaVariant) {
    this.id = socialMediaVariant.id;
    this.iconUrl = socialMediaVariant.iconUrl;
    this.name = socialMediaVariant.name;
  }

  public getPublic(): Omit<ISocialMediaVariant, 'id'> {
    return {
      iconUrl: this.iconUrl,
      name: this.name,
    };
  }
}

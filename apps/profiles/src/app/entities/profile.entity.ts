import {
   ICredential,
  IProfile,
  ISocialMedias,
} from '@konstantin-serebryakov-pet-nodejs/interfaces';
import { CredentialEntity } from './credential.entity';
import { SocialMediaNodeEntity } from './socialMediaNode.entity';

export class ProfileEntity implements IProfile {
  id?: string;
  userId: string;
  socialMediaNodes?: SocialMediaNodeEntity[];
  credential?: CredentialEntity | null;

  constructor(profile: IProfile) {
    this.id = profile.id;
    this.userId = profile.userId;
    this.socialMediaNodes = profile.socialMediaNodes?.map((socialMedia) => {
      return new SocialMediaNodeEntity(socialMedia);
    });
    if (profile.credential)
      this.credential = new CredentialEntity(profile.credential);
  }

  public getPublicSelf(): Omit<IProfile, 'id' | 'socialMediaNodes' | 'credential'> {
    return {
      userId: this.userId,
    };
  }

  public getPublicNested(): Omit<IProfile, 'id'> {
    return {
      userId: this.userId,
      socialMediaNodes: this.socialMediaNodes?.map((SocialMediaEntity) =>
        SocialMediaEntity.getPublicNested()
      ),
      credential: this.credential?.getPublic(),
    };
  }

  public getSocialMediasEntity() {
    return this.socialMediaNodes;
  }

  public getCredentialsEntity() {
    return this.credential;
  }
}

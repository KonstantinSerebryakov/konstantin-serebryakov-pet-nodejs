import { IProfile } from '@konstantin-serebryakov-pet-nodejs/interfaces';
import { CredentialEntity } from './credential.entity';
import { SocialMediaNodeEntity } from './socialMediaNode.entity';
import { EssentialInfoEntity } from './essentialInfo.entity';

export class ProfileEntity implements IProfile {
  id?: string;
  userId: string;
  socialMediaNodes?: SocialMediaNodeEntity[];
  credential?: CredentialEntity | null;
  essentialInfo?: EssentialInfoEntity | null;

  constructor(profile: IProfile) {
    this.id = profile.id;
    this.userId = profile.userId;
    this.socialMediaNodes = profile.socialMediaNodes?.map((socialMedia) => {
      return new SocialMediaNodeEntity(socialMedia);
    });
    if (profile.credential)
      this.credential = new CredentialEntity(profile.credential);
    if (profile.essentialInfo)
      this.essentialInfo = new EssentialInfoEntity(profile.essentialInfo);
  }

  public getPublicSelf(): Omit<
    IProfile,
    'id' | 'socialMediaNodes' | 'credential' | 'essentialInfo'
  > {
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

  public getEssentialInfoEntity() {
    return this.essentialInfo;
  }
}

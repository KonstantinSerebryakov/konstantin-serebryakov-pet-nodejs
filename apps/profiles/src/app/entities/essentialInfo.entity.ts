import { ICredential, IEssentialInfo } from '@konstantin-serebryakov-pet-nodejs/interfaces';

export class EssentialInfoEntity implements IEssentialInfo {
  id?: string;
  profileId?: string;
  position?: string;
  about?: string;

  constructor(essentialInfo: IEssentialInfo) {
    this.id = essentialInfo.id;
    this.profileId = essentialInfo.profileId;
    this.position = essentialInfo.position;
    this.about = essentialInfo.about;
  }

  public getPublic(): Omit<IEssentialInfo, 'id' | 'profileId'> {
    return {
      position: this.position,
      about: this.about,
    };
  }
}

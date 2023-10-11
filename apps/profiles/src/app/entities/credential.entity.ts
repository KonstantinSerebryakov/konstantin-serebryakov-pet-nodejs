import { ICredential } from '@konstantin-serebryakov-pet-nodejs/interfaces';

export class CredentialEntity implements ICredential {
  id?: string;
  profileId?: string;
  firstName: string;
  lastName: string;
  birthday: Date | null;

  constructor(credential: ICredential) {
    this.id = credential.id;
    this.profileId = credential.profileId;
    this.firstName = credential.firstName;
    this.lastName = credential.lastName;
    this.birthday = credential.birthday;
  }

  public getPublic(): Omit<ICredential, 'id' | 'profileId'> {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      birthday: this.birthday,
    };
  }
}

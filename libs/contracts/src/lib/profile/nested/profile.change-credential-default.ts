import {
  ICredential,
  IProfile,
} from '@konstantin-serebryakov-pet-nodejs/interfaces';
import { IsString } from 'class-validator';

export namespace ProfileChangeCredentialDefault {
  export const topic = 'profile.change_profile_credential_default.command';

  export class Request {
    @IsString()
    userId: string;

    credential: Omit<ICredential, 'id' | 'profileId'>;
  }

  export class Response implements Pick<ICredential, 'id' | 'profileId'> {
    id?: string;
    profileId?: string;
  }
}

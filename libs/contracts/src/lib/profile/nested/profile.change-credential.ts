import {
  ICredential,
} from '@konstantin-serebryakov-pet-nodejs/interfaces';
import { IsString } from 'class-validator';

export namespace ProfileChangeCredential {
  export const topic = 'profile.change_profile_credential.command';

  export class Request {
    @IsString()
    profileId: string;

    @IsString()
    userId: string;

    credential: Omit<ICredential, 'id' | 'profileId'>;
  }

  export class Response implements Partial<Pick<ICredential, 'id' | 'profileId'>> {
    id?: string;
    profileId?: string;
  }
}

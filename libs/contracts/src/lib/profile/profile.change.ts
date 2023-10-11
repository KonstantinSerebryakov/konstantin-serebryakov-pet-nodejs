import { IProfile } from '@konstantin-serebryakov-pet-nodejs/interfaces';
import { IsString } from 'class-validator';

export namespace ProfileChange {
  export const topic = 'profile.change_user_profile.command';

  export class Request {
    @IsString()
    userId: string;

    @IsString()
    profileId: string;

    profile: Omit<IProfile, 'id'>;
  }

  export class Response implements Pick<IProfile, 'id' | 'userId'> {
    id?: string;
    userId: string;
  }
}

import { IProfile } from '@konstantin-serebryakov-pet-nodejs/interfaces';
import { IsString } from 'class-validator';

export namespace ProfileQueryUserProfilesIds {
  export const topic = 'profile.user_profiles_ids.query';

  export class Request {
    @IsString()
    userId: string;
  }

  export class Response {
    profileIds: string[];
  }
}

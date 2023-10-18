import { IProfile } from '@konstantin-serebryakov-pet-nodejs/interfaces';
import { IsString } from 'class-validator';

export namespace ProfileQueryUserProfilesList {
  export const topic = 'profile.user_profiles_list.query';

  export class Request {
    @IsString()
    userId: string;
  }

  export class Response {
    profiles: Partial<IProfile>[];
  }
}

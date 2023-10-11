import { IProfile } from '@konstantin-serebryakov-pet-nodejs/interfaces';
import { IsString } from 'class-validator';

export namespace ProfileChangeDefault {
  export const topic = 'profile.change_user_profile_default.command';

  export class Request {
    @IsString()
    userId: string;

    profile: Omit<IProfile, 'id'>;
  }

  export class Response implements Pick<IProfile, 'id'> {
    id: string;
  }
}

import { IProfile } from '@konstantin-serebryakov-pet-nodejs/interfaces';
import { IsString } from 'class-validator';

export namespace ProfileDeleteOne {
  export const topic = 'profile.delete_user_profile.command';

  export class Request {
    @IsString()
    userId: string;

    @IsString()
    profileId: string;
  }

  export class Response implements Pick<IProfile, 'id' | 'userId'> {
    id: string;
    userId: string;
  }
}

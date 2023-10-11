import { IProfile } from '@konstantin-serebryakov-pet-nodejs/interfaces';
import { IsString } from 'class-validator';

export namespace ProfileCreateOne {
  export const topic = 'profile.create_user_profile.command';

  export class Request {
    @IsString()
    userId: string;
  }

  export class Response implements Pick<IProfile, 'id' | 'userId'> {
    id: string;
    userId: string;
  }
}

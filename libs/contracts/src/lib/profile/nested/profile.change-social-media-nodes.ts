import {
  ISocialMediaNode,
} from '@konstantin-serebryakov-pet-nodejs/interfaces';
import { IsString } from 'class-validator';

export namespace ProfileChangeSocialMediaNodes {
  export const topic = 'profile.change_social_media_nodes.command';

  export class Request {
    @IsString()
    profileId: string;

    @IsString()
    userId: string;

    socialMediaNodes: Omit<ISocialMediaNode, 'id' | 'profileId'>[];
  }

  export class Response {
    count: number;
  }
}

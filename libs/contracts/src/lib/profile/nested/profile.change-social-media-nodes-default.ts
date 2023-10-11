import {
  ISocialMediaNode,
} from '@konstantin-serebryakov-pet-nodejs/interfaces';
import { IsString } from 'class-validator';

export namespace ProfileChangeSocialMediaNodesDefault {
  export const topic = 'profile.change_social_media_nodes_default.command';

  export class Request {
    @IsString()
    userId: string;

    socialMediaNodes: Omit<ISocialMediaNode, 'id' | 'profileId'>[];
  }

  export class Response {
    count: number;
  }
}

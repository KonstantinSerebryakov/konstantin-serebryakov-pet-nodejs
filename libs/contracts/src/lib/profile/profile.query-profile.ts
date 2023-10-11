import { IProfile } from '@konstantin-serebryakov-pet-nodejs/interfaces';
import { IsString } from 'class-validator';

export namespace ProfileQuery {
	export const topic = 'profile.user_profile.query';

	export class Request {
		@IsString()
		userId: string;

    @IsString()
    profileId: string;
	}

	export class Response {
		profile: IProfile;
	}
}


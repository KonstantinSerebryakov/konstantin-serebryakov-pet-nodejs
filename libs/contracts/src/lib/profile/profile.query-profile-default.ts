import { IProfile } from '@konstantin-serebryakov-pet-nodejs/interfaces';
import { IsString } from 'class-validator';

export namespace ProfileQueryDefault {
	export const topic = 'profile.user_profile_default.query';

	export class Request {
		@IsString()
		userId: string;
	}

	export class Response {
		profile: IProfile;
	}
}


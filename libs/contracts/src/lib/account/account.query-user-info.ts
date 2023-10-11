import { IUser } from '@konstantin-serebryakov-pet-nodejs/interfaces';
import { IsString } from 'class-validator';

export namespace AccountQueryUserInfo {
	export const topic = 'account.user_info.query';

	export class Request {
		@IsString()
		userId: string;
	}

	export class Response {
		user: Omit<IUser, 'passwordHash'>;
	}
}


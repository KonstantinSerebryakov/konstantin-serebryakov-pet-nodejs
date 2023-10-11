import { IUser } from '@konstantin-serebryakov-pet-nodejs/interfaces';
import { IsString } from 'class-validator';

export namespace AccountChangeUserInfo {
	export const topic = 'account.change_user_info.command';

	export class Request {
		@IsString()
		id: string;

		user: Pick<IUser, "isVerified" | "passwordHash">;
	}

	export class Response {}
}


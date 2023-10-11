import { IDomainEvent, IUser } from '@konstantin-serebryakov-pet-nodejs/interfaces';
import { compare, genSalt, hash } from 'bcryptjs';

export class UserEntity implements IUser {
	id?: string;
	email: string;
  isVerified: boolean;
	passwordHash: string;

	constructor(user: IUser) {
		this.id = user.id;
		this.email = user.email;
    this.isVerified = user.isVerified;
		this.passwordHash = user.passwordHash;
	}

	public getPublicProfile() {
		return {
      id: this.id,
			email: this.email,
      isVerified: this.isVerified,
		}
	}

	public async setPassword(password: string) {
		const salt = await genSalt(10);
		this.passwordHash = await hash(password, salt);
		return this;
	}

	public validatePassword(password: string) {
		return compare(password, this.passwordHash);
	}
}

import { Injectable } from '@nestjs/common';
import { RMQService } from 'nestjs-rmq';
import { UserEntity } from './entities/user.entity';
import { UsersRepository } from './repositories/users.repository';
import { UserEventEmitter} from './users.event-emitter';

@Injectable()
export class UserService {
	constructor(
		private readonly usersRepository: UsersRepository,
		private readonly rmqService: RMQService,
		private readonly usersEventEmmiter: UserEventEmitter
	) {}

	private updateUser(user: UserEntity) {
		return Promise.all([
			this.usersRepository.updateUser(user)
		]);
	}
}

import { Module } from '@nestjs/common';
import { UsersRepository } from './repositories/users.repository';
import { UserCommands } from './users.commands';
import { UserEventEmitter } from './users.event-emitter';
import { UserQueries } from './users.queries';
import { UserService } from './users.service';
import { PrismaClientAccountsModule } from '@konstantin-serebryakov-pet-nodejs/prisma-client-accounts';

@Module({
	imports: [PrismaClientAccountsModule],
	providers: [UsersRepository, UserEventEmitter, UserService],
	exports: [UsersRepository, UserEventEmitter],
	controllers: [UserCommands, UserQueries],
})
export class UsersModule {}

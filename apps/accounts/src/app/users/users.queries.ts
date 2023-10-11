import { Body, Controller } from '@nestjs/common';
import { AccountQueryUserInfo } from '@konstantin-serebryakov-pet-nodejs/contracts';
import { RMQValidate, RMQRoute } from 'nestjs-rmq';
import { UserEntity } from './entities/user.entity';
import { UsersRepository } from './repositories/users.repository';
import { IUser } from '@konstantin-serebryakov-pet-nodejs/interfaces';

@Controller()
export class UserQueries {
  constructor(private readonly usersRepository: UsersRepository) {}

  @RMQValidate()
  @RMQRoute(AccountQueryUserInfo.topic)
  async userInfo(
    @Body() { userId }: AccountQueryUserInfo.Request
  ): Promise<AccountQueryUserInfo.Response> {
    const user = await this.usersRepository.findUserById(userId) as IUser;
    const userPublic = new UserEntity(user).getPublicProfile();
    return {
      user: userPublic,
    };
  }
}

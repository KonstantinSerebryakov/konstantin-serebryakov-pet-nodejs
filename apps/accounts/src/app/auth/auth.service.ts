import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccountRegister } from '@konstantin-serebryakov-pet-nodejs/contracts';
import { UserEntity } from '../users/entities/user.entity';
import { UsersRepository } from '../users/repositories/users.repository';
import { UserEventEmitter } from '../users/users.event-emitter';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly usersEventEmitter: UserEventEmitter,
    private readonly jwtService: JwtService
  ) {}

  async register({ email, password }: AccountRegister.Request) {
    const oldUser = await this.usersRepository.findUser(email);
    if (oldUser) {
      throw new Error('Такой пользователь уже зарегистрирован');
    }
    const newUserEntity = await new UserEntity({
      email: email,
      isVerified: false,
      passwordHash: '',
    }).setPassword(password);
    const newUser = await this.usersRepository.createUser(newUserEntity);
    this.usersEventEmitter.emitUserCreated(newUser);
    return { email: newUser.email };
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersRepository.findUser(email);
    if (!user) {
      throw new Error('Неверный логин или пароль');
    }
    const userEntity = new UserEntity(user);
    const isCorrectPassword = await userEntity.validatePassword(password);
    if (!isCorrectPassword) {
      throw new Error('Неверный логин или пароль');
    }
    return { id: user.id };
  }

  async login(id: string) {
    const token = await this.jwtService.signAsync({ id });
    return {
      access_token: token,
    };
  }
}

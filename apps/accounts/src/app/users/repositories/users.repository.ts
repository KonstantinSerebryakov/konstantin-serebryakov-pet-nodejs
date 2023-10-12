import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/accounts';
import { UserEntity } from '../entities/user.entity';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: UserEntity): Promise<UserEntity> {
    const userCreateInput: Prisma.UserCreateInput = {
      id: data.id,
      email: data.email,
      passwordHash: data.passwordHash,
    };

    const newUser = await this.prisma.user.create({
      data: userCreateInput,
    });
    return new UserEntity(newUser);
  }

  async updateUser({ id: _id, ...rest }: UserEntity): Promise<User> {
    return this.prisma.user.update({
      where: { id: _id },
      data: { ...rest },
    });
  }

  async findUser(email: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { email: email },
    });
  }

  async findUserById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id: id },
    });
  }

  async deleteUser(email: string): Promise<User> {
    return this.prisma.user.delete({
      where: { email: email },
    });
  }
}

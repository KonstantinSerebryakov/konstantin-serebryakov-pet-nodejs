import {
  Controller,
  Logger,
  Post,
  UseGuards,
  Get,
  Put,
  Body,
  InternalServerErrorException,
} from '@nestjs/common';
import { JWTAuthGuard } from '../guards/jwt.guard';
import { UserId } from '../guards/user.decorator';
import { RMQService } from 'nestjs-rmq';
import { ApiService } from '../services/api.service';
import { ProfileDto } from '../dtos/profile.dto';
import {
  AccountQueryUserInfo,
} from '@konstantin-serebryakov-pet-nodejs/contracts';

const CONTROLLER_PREFIX = 'users';

@Controller('users')
export class UsersController {
  constructor(
    private readonly rmqService: RMQService,
    private readonly apiService: ApiService
  ) {}

  @UseGuards(JWTAuthGuard)
  @Get('info')
  async getUserInfo(@UserId() userId: string) {
    try {
      const id = await this.apiService.generateRequestId(CONTROLLER_PREFIX);
      return await this.rmqService.send<
        AccountQueryUserInfo.Request,
        AccountQueryUserInfo.Response
      >(
        AccountQueryUserInfo.topic,
        { userId: userId },
        { headers: { requestId: id } }
      );
    } catch (e) {
      if (e instanceof Error) {
        console.log(e.message);
        throw new InternalServerErrorException(e.message);
      }
    }
  }
}

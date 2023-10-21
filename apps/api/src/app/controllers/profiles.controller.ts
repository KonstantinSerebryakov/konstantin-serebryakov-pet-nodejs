import {
  Controller,
  Logger,
  Post,
  UseGuards,
  Get,
  Put,
  Body,
  InternalServerErrorException,
  Param,
  Delete,
} from '@nestjs/common';
import { JWTAuthGuard } from '../guards/jwt.guard';
import { UserId } from '../guards/user.decorator';
import { RMQService } from 'nestjs-rmq';
import { ApiService } from '../services/api.service';
import { ProfileDto } from '../dtos/profile.dto';
import {
  AccountQueryUserInfo,
  ProfileChange,
  ProfileChangeDefault,
  ProfileCreateOne,
  ProfileDeleteOne,
  ProfileQuery,
  ProfileQueryDefault,
  ProfileQueryUserProfilesIds,
  ProfileQueryUserProfilesList,
} from '@konstantin-serebryakov-pet-nodejs/contracts';
import { profile } from 'console';

const CONTROLLER_PREFIX = 'profiles';

@Controller('profiles')
export class ProfilesController {
  constructor(
    private readonly rmqService: RMQService,
    private readonly apiService: ApiService
  ) {}

  @UseGuards(JWTAuthGuard)
  @Get('default')
  async getProfileDefault(@UserId() userId: string) {
    try {
      const id = await this.apiService.generateRequestId(CONTROLLER_PREFIX);
      return await this.rmqService.send<
        ProfileQueryDefault.Request,
        ProfileQueryDefault.Response
      >(
        ProfileQueryDefault.topic,
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

  @UseGuards(JWTAuthGuard)
  @Put('default')
  async changeProfileDefault(
    @UserId() userId: string,
    @Body() profile: ProfileDto
  ) {
    try {
      const id = await this.apiService.generateRequestId(CONTROLLER_PREFIX);
      return await this.rmqService.send<
        ProfileChangeDefault.Request,
        ProfileChangeDefault.Response
      >(
        ProfileChangeDefault.topic,
        { userId: userId, profile: profile },
        { headers: { requestId: id } }
      );
    } catch (e) {
      if (e instanceof Error) {
        console.log(e.message);
        throw new InternalServerErrorException(e.message);
      }
    }
  }

  @UseGuards(JWTAuthGuard)
  @Get('list/id')
  async getProfilesIdsList(@UserId() userId: string) {
    try {
      const id = await this.apiService.generateRequestId(CONTROLLER_PREFIX);
      return await this.rmqService.send<
        ProfileQueryUserProfilesIds.Request,
        ProfileQueryUserProfilesIds.Response
      >(
        ProfileQueryUserProfilesIds.topic,
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

  @UseGuards(JWTAuthGuard)
  @Get('list/essential')
  async getProfilesEssentialsList(@UserId() userId: string) {
    try {
      const id = await this.apiService.generateRequestId(CONTROLLER_PREFIX);
      return await this.rmqService.send<
        ProfileQueryUserProfilesList.Request,
        ProfileQueryUserProfilesList.Response
      >(
        ProfileQueryUserProfilesList.topic,
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

  @UseGuards(JWTAuthGuard)
  @Post('new')
  async createProfile(
    @UserId() userId: string,
    @Param('profileId') profileId: string
  ) {
    try {
      const id = await this.apiService.generateRequestId(CONTROLLER_PREFIX);
      return await this.rmqService.send<
        ProfileCreateOne.Request,
        ProfileCreateOne.Response
      >(
        ProfileCreateOne.topic,
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

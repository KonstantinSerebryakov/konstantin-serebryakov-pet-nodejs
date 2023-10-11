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
  ProfileChangeCredential,
  ProfileChangeCredentialDefault,
  ProfileChangeSocialMediaNodes,
  ProfileCreateOne,
  ProfileDeleteOne,
  ProfileQuery,
} from '@konstantin-serebryakov-pet-nodejs/contracts';
import { ICredential } from '@konstantin-serebryakov-pet-nodejs/interfaces';
import { CredentialDto } from '../dtos/credential.dto';
import { SocialMediaNodeDto } from '../dtos/social-media-node.dto';

const CONTROLLER_PREFIX = 'profiles-nested';
const PARAM_PROFILE_ID = 'profileId';

@Controller(`profiles/profile/:${PARAM_PROFILE_ID}/`)
export class ProfilesNestedController {
  constructor(
    private readonly rmqService: RMQService,
    private readonly apiService: ApiService
  ) {}

  @UseGuards(JWTAuthGuard)
  @Get('')
  async getProfileById(
    @UserId() userId: string,
    @Param(PARAM_PROFILE_ID) profileId: string
  ) {
    try {
      const id = await this.apiService.generateRequestId(CONTROLLER_PREFIX);
      console.log(id);
      console.log(id);
      console.log(id);
      console.log(id);
      console.log(id);
      return await this.rmqService.send<
        ProfileQuery.Request,
        ProfileQuery.Response
      >(
        ProfileQuery.topic,
        { userId: userId, profileId: profileId },
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
  @Put('')
  async changeProfile(
    @UserId() userId: string,
    @Param(PARAM_PROFILE_ID) profileId: string,
    @Body() profile: ProfileDto
  ) {
    try {
      const id = await this.apiService.generateRequestId(CONTROLLER_PREFIX);
      return await this.rmqService.send<
        ProfileChange.Request,
        ProfileChange.Response
      >(
        ProfileChange.topic,
        { userId: userId, profileId: profileId, profile: profile },
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
  @Delete('')
  async deleteProfile(
    @UserId() userId: string,
    @Param(PARAM_PROFILE_ID) profileId: string
  ) {
    try {
      const id = await this.apiService.generateRequestId(CONTROLLER_PREFIX);
      return await this.rmqService.send<
        ProfileDeleteOne.Request,
        ProfileDeleteOne.Response
      >(
        ProfileDeleteOne.topic,
        { userId: userId, profileId: profileId },
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
  @Put('credential')
  async updateProfileCredential(
    @UserId() userId: string,
    @Param(PARAM_PROFILE_ID) profileId: string,
    @Body() credential: CredentialDto
  ) {
    try {
      const id = await this.apiService.generateRequestId(CONTROLLER_PREFIX);
      // await new Promise((resolve, reject)=>{
        // setTimeout(resolve, 10000);
      // });
      return await this.rmqService.send<
        ProfileChangeCredential.Request,
        ProfileChangeCredential.Response
      >(
        ProfileChangeCredential.topic,
        { userId: userId, profileId: profileId, credential: credential },
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
  @Post('social-media-nodes')
  async updateProfileSocialMediaNodes(
    @UserId() userId: string,
    @Param(PARAM_PROFILE_ID) profileId: string,
    @Body() socialMediaNodes: SocialMediaNodeDto[]
  ) {
    try {
      const id = await this.apiService.generateRequestId(CONTROLLER_PREFIX);
      return await this.rmqService.send<
        ProfileChangeSocialMediaNodes.Request,
        ProfileChangeSocialMediaNodes.Response
      >(
        ProfileChangeSocialMediaNodes.topic,
        { userId: userId, profileId: profileId, socialMediaNodes: socialMediaNodes },
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

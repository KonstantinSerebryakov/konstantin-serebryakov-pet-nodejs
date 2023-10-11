import { Body, Controller } from '@nestjs/common';
import { RMQValidate, RMQRoute } from 'nestjs-rmq';
import {
  AccountUserCreatedEvent,
  ProfileChangeDefault,
  ProfileQueryDefault,
} from '@konstantin-serebryakov-pet-nodejs/contracts';
import { ProfileService } from '../services/porfiles.service';

@Controller()
export class ProfilesEvents {
  constructor(private readonly profileService: ProfileService) {}

  @RMQValidate()
  @RMQRoute(AccountUserCreatedEvent.topic)
  async userCreated(
    @Body() { userId }: AccountUserCreatedEvent.Request
  ) {
		this.profileService.generateProfileDefault(userId);
  }
}

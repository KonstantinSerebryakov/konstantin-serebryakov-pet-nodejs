import { IDomainEvent } from '@konstantin-serebryakov-pet-nodejs/interfaces';
import { IsEmail, IsString } from 'class-validator';

export namespace AccountUserCreatedEvent {
  export const topic = 'account.user_created.event';

  export class Request {
    @IsString()
    userId: string;
  }
}

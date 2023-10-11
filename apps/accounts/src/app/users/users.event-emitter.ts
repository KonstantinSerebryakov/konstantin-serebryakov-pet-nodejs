import { Injectable, Logger } from '@nestjs/common';
import { RMQService } from 'nestjs-rmq';
import { UserEntity } from './entities/user.entity';
import { IDomainEvent } from '@konstantin-serebryakov-pet-nodejs/interfaces';
import { AccountUserCreatedEvent } from '@konstantin-serebryakov-pet-nodejs/contracts';

@Injectable()
export class UserEventEmitter {
  constructor(private readonly rmqService: RMQService) {}

  async emitEvent(event: IDomainEvent) {
    try {
      await this.rmqService.notify(event.topic, event.data);
    } catch (e) {
      if (e instanceof Error) {
        Logger.error(e.message);
      }
    }
  }

  async emitUserCreated(user: UserEntity) {
    const event: IDomainEvent = {
      topic: AccountUserCreatedEvent.topic,
      data: { userId: user.id } as AccountUserCreatedEvent.Request,
    };
    return this.emitEvent(event);
  }
}

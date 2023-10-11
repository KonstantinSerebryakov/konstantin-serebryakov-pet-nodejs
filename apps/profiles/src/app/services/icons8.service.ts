import { Injectable, Logger, NotFoundException, NotImplementedException } from '@nestjs/common';
import { RMQService } from 'nestjs-rmq';
import { ProfilesRepository } from '../repositories/profiles.repository';
import { IProfile } from '@konstantin-serebryakov-pet-nodejs/interfaces';
import { SocialMediaVariantEntity } from '../entities/socialMediaVariant.entity';
import { HttpService } from '@nestjs/axios';
// import { IProfileDefaults } from '@konstantin-serebryakov-pet-nodejs/interfaces';

@Injectable()
export class IconsService {
  constructor(
    private readonly httpService: HttpService
  ) {}

  async findIconURL(term: string):Promise<string> {
    //TODO: fetch api for icon url
    throw new NotImplementedException();
  }

  async fillSocialMediaVariantIcons(variants: SocialMediaVariantEntity[]) {
    throw new NotImplementedException();
    for(const variant of variants) {
      variant.iconUrl = await this.findIconURL(variant.name);
    }
  }
}

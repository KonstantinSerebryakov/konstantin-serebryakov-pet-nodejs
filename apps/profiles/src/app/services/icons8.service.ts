import { Injectable, NotImplementedException } from '@nestjs/common';
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

import { ISocialMediaNode, ISocialMedias } from '@konstantin-serebryakov-pet-nodejs/interfaces';
import { IsBoolean, IsDefined, IsEmail, IsNotEmpty, IsNotEmptyObject, IsNumber, IsObject, IsOptional, IsString, IsUrl, MaxLength, MinLength, ValidateNested, validate} from 'class-validator';
import { SocialMediaVariantDto } from './social-media-variant.dto';
import { Type } from 'class-transformer';

export class SocialMediaNodeDto implements ISocialMediaNode {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  id?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  profileId?: string;

  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  socialMediaVariant: SocialMediaVariantDto;

  @IsDefined()
  @IsBoolean()
  isActive: boolean;

  @IsDefined()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  link: string;
}

import {
  IAvatar,
  ICredential,
  IProfile,
  ISocialMedias,
} from '@konstantin-serebryakov-pet-nodejs/interfaces';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsString,
  IsOptional,
  IsPhoneNumber,
  Validate,
  validateOrReject,
  ValidateNested,
  ArrayNotEmpty,
  MaxLength,
  IsNotEmpty,
  IsBoolean,
} from 'class-validator';
import { SocialMediaNodeDto } from './social-media-node.dto';
import { CredentialDto } from './credential.dto';

export class ProfileDto implements IProfile {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  id?: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  userId = "";

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @IsOptional()
  @ValidateNested({each: true})
  @Type(() => SocialMediaNodeDto)
  socialMediaNodes?: SocialMediaNodeDto[];

  @IsOptional()
  @ValidateNested()
  credential?: CredentialDto | null;
}

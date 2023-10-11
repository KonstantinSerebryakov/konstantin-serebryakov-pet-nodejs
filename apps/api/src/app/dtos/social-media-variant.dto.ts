import { ISocialMediaVariant } from '@konstantin-serebryakov-pet-nodejs/interfaces';
import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { Nullable } from 'class-validator-extended';

export class SocialMediaVariantDto implements Omit<ISocialMediaVariant, 'id'> {
  @IsOptional()
  @IsNumber()
  id?: number;

  @Nullable()
  @IsString()
  @MaxLength(255)
  @IsUrl()
  iconUrl: string | null;

  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  @MinLength(2)
  name: string;
}

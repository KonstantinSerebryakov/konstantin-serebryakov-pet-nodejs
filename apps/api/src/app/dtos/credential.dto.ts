import { ICredential } from '@konstantin-serebryakov-pet-nodejs/interfaces';
import {
  IsDate,
  IsDefined,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  Validate,
  ValidateIf,
} from 'class-validator';
import { IsValidBirthday } from '../utility/is-valid-birthday.decorator';
import { Nullable } from 'class-validator-extended';

export class CredentialDto implements ICredential {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  id?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  profileId?: string;

  @IsDefined()
  @IsString()
  @MaxLength(50)
  firstName: string;

  @IsDefined()
  @IsString()
  @MaxLength(50)
  lastName: string;

  @Nullable()
  // @IsDate()
  // @IsValidBirthday()
  birthday: Date | null;
}

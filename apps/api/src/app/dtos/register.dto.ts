import { IsDefined, IsEmail, IsString } from 'class-validator';

export class RegisterDto {
  @IsDefined()
  @IsString()
  @IsEmail()
	email: string;

  @IsDefined()
  @IsString()
	password: string;
}

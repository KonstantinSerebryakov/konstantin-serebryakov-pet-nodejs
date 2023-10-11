import { Validate } from 'class-validator';
import { BirthdayValidator } from './birthday-validator';

export function IsValidBirthday() {
  return Validate(BirthdayValidator);
}

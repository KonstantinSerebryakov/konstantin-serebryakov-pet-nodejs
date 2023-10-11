import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

export const PROJECT_CREATION_YEAR = 2023;
export const MIN_AGE = 7;
export const MIN_BIRTH_YEAR = 1950;
export const MAX_BIRTH_YEAR =
  new Date().getFullYear() >= PROJECT_CREATION_YEAR
    ? new Date().getFullYear() - MIN_AGE
    : PROJECT_CREATION_YEAR - MIN_AGE;

@ValidatorConstraint({ name: 'isValidBirthday', async: false })
export class BirthdayValidator implements ValidatorConstraintInterface {
  validate(value: Date | null, args: ValidationArguments) {
    if (value === null) return true;
    if (value instanceof Date) {
      const year = value.getFullYear();
      return year >= MIN_BIRTH_YEAR && year <= MAX_BIRTH_YEAR;
    }
    return false;
  }

  defaultMessage(args: ValidationArguments) {
    return `The year must be between ${MIN_BIRTH_YEAR} and ${MAX_BIRTH_YEAR}.`;
  }
}

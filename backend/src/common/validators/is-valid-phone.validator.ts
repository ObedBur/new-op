import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsValidPhoneNumber', async: false })
export class IsValidPhoneNumberConstraint implements ValidatorConstraintInterface {
  // Formats RDC: +243XXXXXXXXX ou 0XXXXXXXXX
  private rdPhoneRegex = /^(\+243|0)[0-9]{9}$/;

  validate(phone: string): boolean {
    if (!phone) return false;
    return this.rdPhoneRegex.test(phone);
  }

  defaultMessage(): string {
    return 'Numro invalide. Format: +243XXXXXXXXX ou 0XXXXXXXXX (10 chiffres)';
  }
}

export function IsValidPhoneNumber(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidPhoneNumberConstraint,
    });
  };
}


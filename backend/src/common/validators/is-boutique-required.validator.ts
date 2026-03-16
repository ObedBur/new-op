import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsBoutiqueRequiredForVendor', async: false })
export class IsBoutiqueRequiredForVendorConstraint implements ValidatorConstraintInterface {
  validate(boutiqueName: string, args: ValidationArguments): boolean {
    const role = (args.object as any).role; // On garde un petit cast ici car on ne connat pas la forme de l'objet DTO ici
    
    if (role === 'VENDOR') {
      return !!boutiqueName && boutiqueName.trim().length >= 2;
    }
    
    return true; // Optionnel pour clients
  }

  defaultMessage(): string {
    return 'Nom de boutique requis pour vendeurs (minimum 2 caractres)';
  }
}

export function IsBoutiqueRequiredForVendor(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsBoutiqueRequiredForVendorConstraint,
    });
  };
}


import { ValidationOptions, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
export declare class IsBoutiqueRequiredForVendorConstraint implements ValidatorConstraintInterface {
    validate(boutiqueName: string, args: ValidationArguments): boolean;
    defaultMessage(): string;
}
export declare function IsBoutiqueRequiredForVendor(validationOptions?: ValidationOptions): (object: object, propertyName: string) => void;

import { ValidationOptions, ValidatorConstraintInterface } from 'class-validator';
export declare class IsValidPhoneNumberConstraint implements ValidatorConstraintInterface {
    private rdPhoneRegex;
    validate(phone: string): boolean;
    defaultMessage(): string;
}
export declare function IsValidPhoneNumber(validationOptions?: ValidationOptions): (object: object, propertyName: string) => void;

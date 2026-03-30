import { ValidationOptions, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { LocationService } from '../services/location.service';
export declare class IsValidCommuneConstraint implements ValidatorConstraintInterface {
    private readonly locationService;
    constructor(locationService: LocationService);
    validate(commune: string, args: ValidationArguments): boolean;
    defaultMessage(args: ValidationArguments): string;
}
export declare function IsValidCommune(validationOptions?: ValidationOptions): (object: object, propertyName: string) => void;

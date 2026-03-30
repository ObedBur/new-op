import { ValidationOptions, ValidatorConstraintInterface } from 'class-validator';
import { LocationService } from '../services/location.service';
export declare class IsValidProvinceConstraint implements ValidatorConstraintInterface {
    private readonly locationService;
    constructor(locationService: LocationService);
    validate(province: string): boolean;
    defaultMessage(): string;
}
export declare function IsValidProvince(validationOptions?: ValidationOptions): (object: object, propertyName: string) => void;

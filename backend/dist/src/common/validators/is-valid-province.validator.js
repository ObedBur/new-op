"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsValidProvinceConstraint = void 0;
exports.IsValidProvince = IsValidProvince;
const class_validator_1 = require("class-validator");
const common_1 = require("@nestjs/common");
const location_service_1 = require("../services/location.service");
let IsValidProvinceConstraint = class IsValidProvinceConstraint {
    constructor(locationService) {
        this.locationService = locationService;
    }
    validate(province) {
        if (!province)
            return false;
        return this.locationService.isValidProvince(province);
    }
    defaultMessage() {
        const provinces = this.locationService.getAllProvinces();
        return `Province invalide. Provinces valides: ${provinces.join(', ')}`;
    }
};
exports.IsValidProvinceConstraint = IsValidProvinceConstraint;
exports.IsValidProvinceConstraint = IsValidProvinceConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'IsValidProvince', async: false }),
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [location_service_1.LocationService])
], IsValidProvinceConstraint);
function IsValidProvince(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsValidProvinceConstraint,
        });
    };
}
//# sourceMappingURL=is-valid-province.validator.js.map
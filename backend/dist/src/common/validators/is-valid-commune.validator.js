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
exports.IsValidCommuneConstraint = void 0;
exports.IsValidCommune = IsValidCommune;
const class_validator_1 = require("class-validator");
const common_1 = require("@nestjs/common");
const location_service_1 = require("../services/location.service");
let IsValidCommuneConstraint = class IsValidCommuneConstraint {
    constructor(locationService) {
        this.locationService = locationService;
    }
    validate(commune, args) {
        const province = args.object.province;
        if (!province || !commune)
            return false;
        return this.locationService.isValidCommune(province, commune);
    }
    defaultMessage(args) {
        const province = args.object.province;
        if (!province)
            return 'Province manquante';
        const communes = this.locationService.getCommunes(province);
        return `Commune invalide pour ${province}. Communes valides: ${communes.join(', ')}`;
    }
};
exports.IsValidCommuneConstraint = IsValidCommuneConstraint;
exports.IsValidCommuneConstraint = IsValidCommuneConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'IsValidCommune', async: false }),
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [location_service_1.LocationService])
], IsValidCommuneConstraint);
function IsValidCommune(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsValidCommuneConstraint,
        });
    };
}
//# sourceMappingURL=is-valid-commune.validator.js.map
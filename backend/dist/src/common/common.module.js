"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonModule = void 0;
const common_1 = require("@nestjs/common");
const location_service_1 = require("./services/location.service");
const is_valid_province_validator_1 = require("./validators/is-valid-province.validator");
const is_valid_commune_validator_1 = require("./validators/is-valid-commune.validator");
const is_valid_phone_validator_1 = require("./validators/is-valid-phone.validator");
const is_boutique_required_validator_1 = require("./validators/is-boutique-required.validator");
const moderation_service_1 = require("./services/moderation.service");
let CommonModule = class CommonModule {
};
exports.CommonModule = CommonModule;
exports.CommonModule = CommonModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [
            location_service_1.LocationService,
            is_valid_province_validator_1.IsValidProvinceConstraint,
            is_valid_commune_validator_1.IsValidCommuneConstraint,
            is_valid_phone_validator_1.IsValidPhoneNumberConstraint,
            is_boutique_required_validator_1.IsBoutiqueRequiredForVendorConstraint,
            moderation_service_1.ModerationService,
        ],
        exports: [
            location_service_1.LocationService,
            is_valid_province_validator_1.IsValidProvinceConstraint,
            is_valid_commune_validator_1.IsValidCommuneConstraint,
            is_valid_phone_validator_1.IsValidPhoneNumberConstraint,
            is_boutique_required_validator_1.IsBoutiqueRequiredForVendorConstraint,
            moderation_service_1.ModerationService,
        ],
    })
], CommonModule);
//# sourceMappingURL=common.module.js.map
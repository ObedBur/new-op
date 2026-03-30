"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsBoutiqueRequiredForVendorConstraint = void 0;
exports.IsBoutiqueRequiredForVendor = IsBoutiqueRequiredForVendor;
const class_validator_1 = require("class-validator");
let IsBoutiqueRequiredForVendorConstraint = class IsBoutiqueRequiredForVendorConstraint {
    validate(boutiqueName, args) {
        const role = args.object.role;
        if (role === 'VENDOR') {
            return !!boutiqueName && boutiqueName.trim().length >= 2;
        }
        return true;
    }
    defaultMessage() {
        return 'Nom de boutique requis pour vendeurs (minimum 2 caractres)';
    }
};
exports.IsBoutiqueRequiredForVendorConstraint = IsBoutiqueRequiredForVendorConstraint;
exports.IsBoutiqueRequiredForVendorConstraint = IsBoutiqueRequiredForVendorConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'IsBoutiqueRequiredForVendor', async: false })
], IsBoutiqueRequiredForVendorConstraint);
function IsBoutiqueRequiredForVendor(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsBoutiqueRequiredForVendorConstraint,
        });
    };
}
//# sourceMappingURL=is-boutique-required.validator.js.map
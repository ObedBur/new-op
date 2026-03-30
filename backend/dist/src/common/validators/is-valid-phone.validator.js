"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsValidPhoneNumberConstraint = void 0;
exports.IsValidPhoneNumber = IsValidPhoneNumber;
const class_validator_1 = require("class-validator");
let IsValidPhoneNumberConstraint = class IsValidPhoneNumberConstraint {
    constructor() {
        this.rdPhoneRegex = /^(\+243|0)[0-9]{9}$/;
    }
    validate(phone) {
        if (!phone)
            return false;
        return this.rdPhoneRegex.test(phone);
    }
    defaultMessage() {
        return 'Numro invalide. Format: +243XXXXXXXXX ou 0XXXXXXXXX (10 chiffres)';
    }
};
exports.IsValidPhoneNumberConstraint = IsValidPhoneNumberConstraint;
exports.IsValidPhoneNumberConstraint = IsValidPhoneNumberConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'IsValidPhoneNumber', async: false })
], IsValidPhoneNumberConstraint);
function IsValidPhoneNumber(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsValidPhoneNumberConstraint,
        });
    };
}
//# sourceMappingURL=is-valid-phone.validator.js.map
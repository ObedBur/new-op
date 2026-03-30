"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const auth_constants_1 = require("../constants/auth.constants");
let PasswordService = class PasswordService {
    async hash(password) {
        return bcrypt.hash(password, auth_constants_1.AUTH_CONSTANTS.BCRYPT_ROUNDS);
    }
    async compare(password, hash) {
        if (!password || !hash)
            return false;
        return bcrypt.compare(password, hash);
    }
    validateComplexity(password) {
        if (!auth_constants_1.AUTH_CONSTANTS.PASSWORD_REGEX.test(password)) {
            throw new common_1.HttpException('Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async generateResetToken() {
        const token = crypto.randomBytes(auth_constants_1.AUTH_CONSTANTS.RESET_TOKEN_BYTES).toString('hex');
        const hash = await this.hash(token);
        return { token, hash };
    }
    async verifyResetToken(token, hash) {
        return this.compare(token, hash);
    }
};
exports.PasswordService = PasswordService;
exports.PasswordService = PasswordService = __decorate([
    (0, common_1.Injectable)()
], PasswordService);
//# sourceMappingURL=password.service.js.map
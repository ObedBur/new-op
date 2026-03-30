"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AUTH_CONSTANTS = void 0;
exports.AUTH_CONSTANTS = {
    BCRYPT_ROUNDS: 10,
    MIN_SECRET_LENGTH_PROD: 32,
    MIN_SECRET_LENGTH_DEV: 16,
    PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    RESET_TOKEN_BYTES: 32,
    OTP_EXPIRY_MS: 10 * 60 * 1000,
    RESET_TOKEN_EXPIRY_MS: 60 * 60 * 1000,
    REFRESH_TOKEN_EXPIRY_MS: 7 * 24 * 60 * 60 * 1000,
    ACCESS_TOKEN_EXPIRY: '1h',
    REFRESH_TOKEN_EXPIRY: '7d',
    MAX_OTP_ATTEMPTS: 3,
    INITIAL_TRUST_SCORE_CLIENT: 70,
    INITIAL_TRUST_SCORE_VENDOR: 50,
    VERIFICATION_BONUS_SCORE: 20,
    DEV_SECRETS: {
        JWT_SECRET: 'dev_jwt_secret_min_16_chars_for_wapibei',
        JWT_REFRESH_SECRET: 'dev_refresh_secret_min_16_chars_for_wapibei',
    }
};
//# sourceMappingURL=auth.constants.js.map
export declare const AUTH_CONSTANTS: {
    readonly BCRYPT_ROUNDS: 10;
    readonly MIN_SECRET_LENGTH_PROD: 32;
    readonly MIN_SECRET_LENGTH_DEV: 16;
    readonly PASSWORD_REGEX: RegExp;
    readonly RESET_TOKEN_BYTES: 32;
    readonly OTP_EXPIRY_MS: number;
    readonly RESET_TOKEN_EXPIRY_MS: number;
    readonly REFRESH_TOKEN_EXPIRY_MS: number;
    readonly ACCESS_TOKEN_EXPIRY: "1h";
    readonly REFRESH_TOKEN_EXPIRY: "7d";
    readonly MAX_OTP_ATTEMPTS: 3;
    readonly INITIAL_TRUST_SCORE_CLIENT: 70;
    readonly INITIAL_TRUST_SCORE_VENDOR: 50;
    readonly VERIFICATION_BONUS_SCORE: 20;
    readonly DEV_SECRETS: {
        readonly JWT_SECRET: "dev_jwt_secret_min_16_chars_for_wapibei";
        readonly JWT_REFRESH_SECRET: "dev_refresh_secret_min_16_chars_for_wapibei";
    };
};

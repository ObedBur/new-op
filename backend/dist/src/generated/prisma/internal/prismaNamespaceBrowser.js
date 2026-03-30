"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NullsOrder = exports.QueryMode = exports.SortOrder = exports.ProductScalarFieldEnum = exports.CategoryScalarFieldEnum = exports.RefreshTokenScalarFieldEnum = exports.UserScalarFieldEnum = exports.TransactionIsolationLevel = exports.ModelName = exports.AnyNull = exports.JsonNull = exports.DbNull = exports.NullTypes = exports.Decimal = void 0;
const runtime = require("@prisma/client/runtime/index-browser");
exports.Decimal = runtime.Decimal;
exports.NullTypes = {
    DbNull: runtime.NullTypes.DbNull,
    JsonNull: runtime.NullTypes.JsonNull,
    AnyNull: runtime.NullTypes.AnyNull,
};
exports.DbNull = runtime.DbNull;
exports.JsonNull = runtime.JsonNull;
exports.AnyNull = runtime.AnyNull;
exports.ModelName = {
    User: 'User',
    RefreshToken: 'RefreshToken',
    Category: 'Category',
    Product: 'Product'
};
exports.TransactionIsolationLevel = runtime.makeStrictEnum({
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
});
exports.UserScalarFieldEnum = {
    id: 'id',
    email: 'email',
    password: 'password',
    fullName: 'fullName',
    phone: 'phone',
    province: 'province',
    commune: 'commune',
    address: 'address',
    role: 'role',
    boutiqueName: 'boutiqueName',
    isVerified: 'isVerified',
    otpHash: 'otpHash',
    otpExpiresAt: 'otpExpiresAt',
    resetTokenHash: 'resetTokenHash',
    resetTokenExpiresAt: 'resetTokenExpiresAt',
    kycStatus: 'kycStatus',
    kycSubmittedAt: 'kycSubmittedAt',
    kycApprovedAt: 'kycApprovedAt',
    kycRejectedAt: 'kycRejectedAt',
    kycRejectionReason: 'kycRejectionReason',
    trustScore: 'trustScore',
    dailyPublications: 'dailyPublications',
    lastPublicationDate: 'lastPublicationDate',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    otpAttempts: 'otpAttempts'
};
exports.RefreshTokenScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    tokenHash: 'tokenHash',
    expiresAt: 'expiresAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.CategoryScalarFieldEnum = {
    id: 'id',
    name: 'name',
    icon: 'icon',
    colorClass: 'colorClass',
    bgClass: 'bgClass',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.ProductScalarFieldEnum = {
    id: 'id',
    name: 'name',
    description: 'description',
    price: 'price',
    displayPrice: 'displayPrice',
    location: 'location',
    image: 'image',
    availability: 'availability',
    market: 'market',
    categoryId: 'categoryId',
    userId: 'userId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.SortOrder = {
    asc: 'asc',
    desc: 'desc'
};
exports.QueryMode = {
    default: 'default',
    insensitive: 'insensitive'
};
exports.NullsOrder = {
    first: 'first',
    last: 'last'
};
//# sourceMappingURL=prismaNamespaceBrowser.js.map
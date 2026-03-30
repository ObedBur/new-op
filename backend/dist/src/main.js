"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const path = require("path");
const envPaths = [
    path.join(process.cwd(), '.env'),
    path.join(process.cwd(), '.env.local')
];
for (const envPath of envPaths) {
    dotenv.config({ path: envPath });
    if (process.env.DATABASE_URL)
        break;
}
if (!process.env.DATABASE_URL) {
    process.exit(1);
}
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const platform_fastify_1 = require("@nestjs/platform-fastify");
const common_1 = require("@nestjs/common");
const helmet_1 = require("@fastify/helmet");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_fastify_1.FastifyAdapter({
        trustProxy: true,
        logger: true,
        bodyLimit: 50 * 1024 * 1024,
    }));
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    const isDev = process.env.NODE_ENV !== 'production';
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    app.enableCors({
        origin: isDev ? true : [frontendUrl, 'http://localhost:3000', 'http://127.0.0.1:3000'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
    });
    await app.register(helmet_1.default, {
        contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
        crossOriginResourcePolicy: { policy: 'cross-origin' }
    });
    const port = process.env.PORT || 4000;
    await app.listen(port, '0.0.0.0');
    console.log(`🚀 WapiBei est en ligne sur http://localhost:${port}`);
    const accessExpiry = process.env.JWT_ACCESS_EXPIRATION || '1h (default)';
    const refreshExpiry = process.env.JWT_REFRESH_EXPIRATION || '7d (default)';
    console.log(`🔐 JWT Config: Access (${accessExpiry}), Refresh (${refreshExpiry})`);
}
bootstrap();
//# sourceMappingURL=main.js.map
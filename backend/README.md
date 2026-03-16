# Backend - NestJS API

A NestJS-based backend application for managing products, orders, sellers, and authentication.

## Features

- **Authentication**: JWT-based authentication with refresh tokens
- **Authorization**: Role-based access control (Admin, User, Seller)
- **Database**: PostgreSQL with Prisma ORM
- **Email Integration**: Support for email notifications
- **WhatsApp Integration**: WhatsApp messaging support
- **Admin Panel**: Admin management functionality
- **Performance Logging**: Request and performance tracking
- **Testing**: Jest unit and E2E tests

## Prerequisites

- Node.js v18+ 
- PostgreSQL
- npm or pnpm

## Installation

1. Install dependencies:
```bash
npm install
# or
pnpm install
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Generate Prisma client:
```bash
npm run prisma:generate
```

4. Run database migrations:
```bash
npm run prisma:migrate:dev
```

5. Seed database (optional):
```bash
npm run prisma:seed
```

## Running the Application

### Development
```bash
npm run start:dev
```

### Production
```bash
npm run build
npm run start:prod
```

### Debug Mode
```bash
npm run start:debug
```

## Database Management

### Prisma Studio
View and manage data in a web UI:
```bash
npm run prisma:studio
```

### Create Migration
```bash
npm run prisma:migrate:dev -- --name migration_name
```

### Apply Migrations (Production)
```bash
npm run prisma:migrate:prod
```

## Testing

### Unit Tests
```bash
npm run test
```

### Watch Mode
```bash
npm run test:watch
```

### Coverage Report
```bash
npm run test:cov
```

### E2E Tests
```bash
npm run test:e2e
```

## Project Structure

```
src/
├── admin/          # Admin management
├── auth/           # Authentication & authorization
├── categories/     # Product categories
├── common/         # Shared utilities, guards, interfaces
├── content/        # Content management
├── orders/         # Order management
├── products/       # Product management
├── sellers/        # Seller management
├── prisma/         # Prisma service & module
├── app.module.ts   # Root module
└── main.ts         # Application entry point

prisma/
├── schema.prisma   # Database schema
└── seed.ts         # Database seeding script
```

## API Documentation

### Authentication Endpoints
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout user
- `POST /auth/verify-otp` - Verify OTP
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password

### Admin Endpoints
- `GET /admin/activities` - Get admin activities
- `GET /admin/users` - Manage users

### Products Endpoints
- `GET /products` - List all products
- `GET /products/:id` - Get product details
- `POST /products` - Create product (Admin only)
- `PATCH /products/:id` - Update product (Admin only)
- `DELETE /products/:id` - Delete product (Admin only)

### Categories Endpoints
- `GET /categories` - List all categories
- `POST /categories` - Create category (Admin only)
- `PATCH /categories/:id` - Update category (Admin only)
- `DELETE /categories/:id` - Delete category (Admin only)

### Orders Endpoints
- `GET /orders` - Get user orders
- `POST /orders` - Create order
- `GET /orders/:id` - Get order details

### Sellers Endpoints
- `GET /sellers` - List sellers
- `GET /sellers/:id` - Get seller details
- `POST /sellers` - Create seller (Admin only)

## Environment Variables

See `.env.example` for all available configuration options.

Key variables:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT signing
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `SMTP_*` - Email configuration
- `WHATSAPP_*` - WhatsApp integration settings

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check `DATABASE_URL` in `.env`
- Ensure database exists

### Migration Errors
- Run `npx prisma migrate resolve --rolled-back` to resolve conflict
- Check Prisma schema syntax

### JWT Token Issues
- Verify `JWT_SECRET` is set
- Check token expiration in `.env`

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests: `npm run test`
4. Format code: `npm run format`
5. Submit a pull request

## License

Proprietary - All rights reserved

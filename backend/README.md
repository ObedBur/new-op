<<<<<<< HEAD
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
- Verify `JWT_SECRET` is se 
- Check token expiration in `.env`

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests: `npm run test`
4. Format code: `npm run format`
5. Submit a pull request

## License

Proprietary - All rights reserved
=======
<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ pnpm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
>>>>>>> 290370a19af069c11dcba02e6949aa48c45160ef

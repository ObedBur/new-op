# Monorepo

## Structure

```
kaskade/
├── backend/          # NestJS API
├── frontend/         # Next.js Web App
├── pnpm-workspace.yaml
└── package.json
```

## Quick Start

### Install dependencies
```bash
pnpm install
```

### Development

Run all services in parallel:
```bash
pnpm dev
```

Or run individually:
```bash
pnpm backend:dev    # Start NestJS server
pnpm frontend:dev   # Start Next.js dev server
```

### Build

Build all packages:
```bash
pnpm build
```

Or specific packages:
```bash
pnpm backend:build    # Build NestJS
pnpm frontend:build   # Build Next.js
```

### Testing

```bash
pnpm test           # Run all tests
pnpm test:e2e       # Run e2e tests
```

### Linting & Formatting

```bash
pnpm lint           # Lint all packages
pnpm format         # Format all packages
```

## Scripts Documentation

| Script | Description |
|--------|-------------|
| `pnpm dev` | Run all services in development mode |
| `pnpm build` | Build all packages |
| `pnpm start` | Start all services |
| `pnpm test` | Run tests across workspace |
| `pnpm lint` | Lint all packages |
| `pnpm format` | Format code in all packages |
| `pnpm backend:dev` | Start only backend development server |
| `pnpm frontend:dev` | Start only frontend development server |

## Key Directories

- **backend/src** - NestJS application source code
- **frontend/src** - Next.js application source code
- **backend/prisma** - Database schema and migrations
- **frontend/prisma** - Frontend Prisma schema (if needed)

## Technologies

- **Backend**: NestJS, Prisma, PostgreSQL
- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Package Manager**: pnpm

# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install --no-frozen-lockfile

# Copy source code
COPY . .

# Generate Prisma client (DATABASE_URL not needed for client generation)
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" pnpm run prisma:generate

# Build NestJS app
RUN pnpm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install all dependencies (including Prisma for migrations)
RUN pnpm install --no-frozen-lockfile

# Copy built app from builder
COPY --from=builder /app/dist ./dist

# Copy prisma schema and migrations
COPY prisma ./prisma

# Expose port (default 3000 for NestJS)
EXPOSE 3000

# Export DATABASE_URL as env var and run app
CMD ["sh", "-c", "node dist/main"]

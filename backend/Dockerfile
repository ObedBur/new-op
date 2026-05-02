# Étape 1 : Build
FROM node:20-alpine AS builder
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

# On copie les fichiers de config qui sont au même niveau que ce Dockerfile
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY backend/package.json ./backend/
COPY backend/prisma ./backend/prisma/

# Installation des dépendances
RUN pnpm install --no-frozen-lockfile

# Copie du code source du backend
COPY backend ./backend

# Build du backend
RUN pnpm --filter backend build

# Étape 2 : Production
FROM node:20-alpine AS production
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY --from=builder /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
COPY --from=builder /app/backend/package.json ./backend/
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/prisma ./backend/prisma
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/backend/node_modules ./backend/node_modules

ENV NODE_ENV=production
ENV PORT=4000
EXPOSE 4000
CMD ["node", "backend/dist/main.js"]
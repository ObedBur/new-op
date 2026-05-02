FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate

# 1. On copie les fichiers de configuration du monorepo
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

# 2. On copie les fichiers nécessaires du package backend (incluant le schéma Prisma)
COPY backend/package.json ./backend/
COPY backend/prisma ./backend/prisma/

# 3. Installation des dépendances
RUN pnpm install --no-frozen-lockfile

# --- ÉTAPE MANQUANTE : GÉNÉRATION DU CLIENT PRISMA ---
COPY backend ./backend
RUN pnpm --filter backend exec prisma generate

# 5. Build du projet
RUN pnpm --filter backend build

FROM node:20-alpine AS production
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY --from=builder /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
COPY --from=builder /app/backend/package.json ./backend/
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/prisma ./backend/prisma
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/backend/node_modules ./backend/node_modules

# On s'assure que le client généré est aussi copié pour la production
COPY --from=builder /app/node_modules/.pnpm/@prisma+client@* ./node_modules/.pnpm/

ENV NODE_ENV=production
ENV PORT=4000
EXPOSE 4000
CMD ["node", "backend/dist/main.js"]
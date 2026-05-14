# --- ÉTAPE 1 : BUILDER ---
FROM node:20-alpine AS builder

# Installation des outils nécessaires
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Activation de pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# 1. Copie des fichiers de configuration du monorepo
# Ces fichiers sont nécessaires pour que pnpm comprenne l'espace de travail
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

# 2. Copie des fichiers de structure du backend
# On copie le package.json et le dossier prisma avant l'install pour optimiser le cache Docker
COPY backend/package.json ./backend/
COPY backend/prisma ./backend/prisma/

# 3. Installation des dépendances pour tout le monorepo
# --no-frozen-lockfile permet d'éviter des erreurs si le lockfile a été généré sur Windows
RUN pnpm install --no-frozen-lockfile

# 4. Copie du reste du code source du backend
COPY backend ./backend

# 5. GÉNÉRATION DU CLIENT PRISMA
# On injecte une DATABASE_URL factice pour que Prisma puisse générer les types TypeScript 
# sans avoir besoin d'une connexion réelle à la base de données pendant le build.
RUN DATABASE_URL="postgresql://fake:fake@localhost:5432/fake" pnpm --filter backend exec prisma generate

# 6. BUILD DU PROJET NESTJS
# Cette étape transforme ton code TS en JS dans le dossier backend/dist
RUN pnpm --filter backend build

# --- ÉTAPE 2 : RUNNER (PRODUCTION) ---
FROM node:20-alpine AS production

# Installation de pnpm (INDISPENSABLE - chaque FROM repart de zéro)
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copie des fichiers de configuration du monorepo
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copie du package.json backend pour l'installation des dépendances de production
COPY backend/package.json ./backend/
COPY backend/prisma ./backend/prisma/
COPY backend/prisma.config.ts ./backend/

# Installation des dépendances de PRODUCTION uniquement
RUN pnpm install --no-frozen-lockfile --prod --filter backend

# RÉGÉNÉRATION DU CLIENT DANS L'ENVIRONNEMENT DE PROD
# On injecte une URL factice pour permettre la génération sans erreur.
RUN DATABASE_URL="postgresql://fake:fake@localhost:5432/fake" pnpm --filter backend exec prisma generate

# Copie du code compilé (dist) depuis le builder
COPY --from=builder /app/backend/dist ./backend/dist

COPY backend/docker-entrypoint.sh ./backend/docker-entrypoint.sh
RUN chmod +x ./backend/docker-entrypoint.sh

# Exposition du port (correspond à ta config Render)
EXPOSE 4000

WORKDIR /app/backend
CMD ["/bin/sh", "/app/backend/docker-entrypoint.sh"]

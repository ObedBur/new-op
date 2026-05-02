# Étape 1 : Build de l'application
FROM node:20-alpine AS builder

WORKDIR /app

# Installation de pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# COPIE DES CONFIGURATIONS (On remonte d'un cran pour le Monorepo)
# Ces fichiers sont à la racine du projet
COPY ../package.json ../pnpm-lock.yaml ../pnpm-workspace.yaml ../turbo.json ./

# COPIE DU BACKEND (Local au dossier actuel)
COPY package.json ./backend/
COPY prisma ./backend/prisma/

# Installation des dépendances
RUN pnpm install --no-frozen-lockfile

# Copie de tout le code source du backend
COPY . ./backend

# Build du backend uniquement via son filtre
RUN pnpm --filter backend build

# Étape 2 : Image de production légère
FROM node:20-alpine AS production

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

# Récupération des fichiers nécessaires pour l'exécution
COPY --from=builder /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
COPY --from=builder /app/backend/package.json ./backend/
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/prisma ./backend/prisma
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/backend/node_modules ./backend/node_modules

# Configuration de l'environnement
ENV NODE_ENV=production
ENV PORT=4000
EXPOSE 4000

# Commande de démarrage pointant sur le fichier compilé
CMD ["node", "backend/dist/main.js"]
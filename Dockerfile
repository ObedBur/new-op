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
RUN DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza19QRHcySHRaa1RnMkJ3VDhPMW9VWi0iLCJhcGlfa2V5IjoiMDFLUkdXMjZYQjZYNlpYTUoyREo5TTc4OVoiLCJ0ZW5hbnRfaWQiOiJjMDAzYzlhZjM5OTk2NmEwZmM3MDMyZmFiZWNkM2VhMDc4MjFjMGYwY2JmMzk2OWU5OTkxMzk2MDM2ZTc4OWM2IiwiaW50ZXJuYWxfc2VjcmV0IjoiNGE3ZmVlYTYtOTg3OS00MTcxLWFiMTQtNGIwZTZjYzNlNTBjIn0.90E8KFzl8jiw9Gpi4e0VCIP19tbDBQPh8ZCfK37UY0w " 

# 6. BUILD DU PROJET NESTJS
# Cette étape transforme ton code TS en JS dans le dossier backend/dist
RUN pnpm --filter backend build

# --- ÉTAPE 2 : RUNNER (PRODUCTION) ---
FROM node:20-alpine AS production
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

# On définit l'environnement en production
ENV NODE_ENV=production

# Copie des fichiers essentiels depuis le builder
COPY --from=builder /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
COPY --from=builder /app/backend/package.json ./backend/
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/prisma ./backend/prisma

# Copie des node_modules (incluant le client Prisma généré)
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/backend/node_modules ./backend/node_modules

# Exposition du port utilisé par NestJS
EXPOSE 4000
ENV PORT=4000

# Commande de démarrage
# Utilisation de node directement pour de meilleures performances en prod
CMD ["node", "backend/dist/main.js"]
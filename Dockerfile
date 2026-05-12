# Image de base Node.js
FROM node:24-slim

# Installation de pnpm
RUN npm install -g pnpm

WORKDIR /app

# On copie d'abord les fichiers de configuration de la racine (si nécessaire)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# On copie le dossier backend
COPY backend/ ./backend/

# On se déplace dans le dossier backend pour l'installation et le build
WORKDIR /app/backend

# Installation des dépendances
RUN pnpm install

# Génération du client Prisma (CRITIQUE pour tes erreurs)
RUN npx prisma generate

# Build du projet NestJS
RUN pnpm run build

# Exposition du port (correspond à ta config Render)
EXPOSE 4000

# Commande de démarrage
CMD ["pnpm", "run", "start:prod"]
# Étape 1 : Build de l'application
FROM node:20-alpine AS builder

WORKDIR /app

# Installation de pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copier uniquement les fichiers nécessaires pour l'installation des dépendances
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/

# Installation des dépendances (y compris devDependencies pour le build)
RUN pnpm install --frozen-lockfile

# Générer le client Prisma
RUN pnpm prisma generate

# Copier le reste du code
COPY . .

# Compiler l'application NestJS
RUN pnpm build

# Étape 2 : Image de production légère
FROM node:20-alpine AS production

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/

# Installer uniquement les dépendances de production
RUN pnpm install --prod --frozen-lockfile

# Générer Prisma (requis pour la prod)
RUN pnpm prisma generate

# Copier les fichiers compilés depuis le builder
COPY --from=builder /app/dist ./dist

# Définir l'environnement de production
ENV NODE_ENV=production
ENV PORT=4000

# Exposer le port de l'application
EXPOSE 4000

# Démarrage de l'application via le dossier compilé
CMD ["node", "dist/main.js"]

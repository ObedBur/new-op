#!/bin/sh
set -e

# Se placer dans le dossier du backend
cd /app/backend

echo "[entrypoint] Mode: $NODE_ENV"
echo "[entrypoint] Vérification de DATABASE_URL..."
if [ -z "$DATABASE_URL" ]; then
    echo "ERREUR : La variable DATABASE_URL est vide !"
    exit 1
fi

echo "[entrypoint] Exécution des migrations Prisma..."
# Les migrations nécessitent une connexion directe (non-poolée) pour les advisory locks.
# On utilise MIGRATE_DATABASE_URL si disponible, sinon DATABASE_URL.
if [ -n "$MIGRATE_DATABASE_URL" ]; then
    echo "[entrypoint] Utilisation de MIGRATE_DATABASE_URL (connexion directe)..."
    DATABASE_URL="$MIGRATE_DATABASE_URL" npx prisma migrate deploy
else
    echo "[entrypoint] Attention: MIGRATE_DATABASE_URL non défini, utilisation de DATABASE_URL..."
    npx prisma migrate deploy
fi

echo "[entrypoint] Lancement de NestJS..."
# On utilise node directement. Si ça crash, le message d'erreur sera visible dans Render.
exec node dist/main.js
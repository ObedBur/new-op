#!/bin/sh
set -e

cd /app/backend

echo "[entrypoint] Mode: $NODE_ENV"

# Migration : utiliser la connexion DIRECTE
if [ -n "$DATABASE_DIRECT_URL" ]; then
    echo "[entrypoint] Migration avec connexion directe..."
    DATABASE_URL="$DATABASE_DIRECT_URL" npx prisma migrate deploy
else
    echo "ERREUR : DATABASE_DIRECT_URL non définie !"
    exit 1
fi

echo "[entrypoint] Lancement NestJS..."
exec node dist/main.js
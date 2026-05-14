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
npx prisma migrate deploy

echo "[entrypoint] Lancement de NestJS..."
# On utilise node directement. Si ça crash, le message d'erreur sera visible dans Render.
exec node dist/main.js
#!/bin/sh
# Applique les migrations puis démarre Nest.
#
# Si Render / la prod affiche P3005 (« database schema is not empty ») parce que la base
# a été créée avec db push ou sans historique migrate : définir PRISMA_MIGRATE_BASELINE=1
# une fois sur le service, redéployer, puis retirer la variable (les lignes ci-dessous
# ne concernent que les dossiers listés ; les nouvelles migrations passent par deploy).

set -eu
cd /app/backend

if [ "${PRISMA_MIGRATE_BASELINE:-}" = "1" ]; then
  echo "[entrypoint] PRISMA_MIGRATE_BASELINE=1 — enregistrement des migrations comme déjà appliquées"
  for name in \
    20260220000000_init \
    20260220200338_add_metadata_to_notifications \
    20260331074906_add_missing_product_fields \
    20260428095000_add_home_product_indexes \
    20260428100500_add_notification_user_createdat_index
  do
    if [ -d "prisma/migrations/${name}" ]; then
      npx prisma migrate resolve --applied "$name" \
        || echo "[entrypoint] baseline: $name ignoré (déjà résolu ou schéma incompatible)"
    fi
  done
fi

echo "[entrypoint] prisma migrate deploy"
npx prisma migrate deploy

echo "[entrypoint] démarrage Nest"
exec node dist/main.js

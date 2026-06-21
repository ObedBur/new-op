-- Migration: improve_cart_item
-- Améliorations : optimistic locking, index composé, contrainte CHECK

-- ─────────────────────────────────────────────
-- 1. Colonne "version" pour l'optimistic locking
-- ─────────────────────────────────────────────
ALTER TABLE "CartItem" ADD COLUMN "version" INTEGER NOT NULL DEFAULT 0;

-- ─────────────────────────────────────────────
-- 2. Contrainte CHECK : quantity doit être > 0
--    Appliquée au niveau PostgreSQL — inviolable
-- ─────────────────────────────────────────────
ALTER TABLE "CartItem"
  ADD CONSTRAINT "CartItem_quantity_positive" CHECK (quantity > 0);

-- ─────────────────────────────────────────────
-- 3. Suppression de l'ancien index simple [userId]
--    (remplacé par l'index composé ci-dessous)
-- ─────────────────────────────────────────────
DROP INDEX IF EXISTS "CartItem_userId_idx";

-- ─────────────────────────────────────────────
-- 4. Index composé [userId, updatedAt DESC]
--    Optimise : findForUser + orderBy updatedAt desc
--    PostgreSQL peut faire un Index Only Scan
-- ─────────────────────────────────────────────
CREATE INDEX "CartItem_userId_updatedAt_idx" ON "CartItem" ("userId", "updatedAt" DESC);

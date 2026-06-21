-- Migration: improve_cart_item
-- Création complète de la table CartItem avec Optimistic Locking et contraintes

-- 1. Création de la table
CREATE TABLE "CartItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "version" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id")
);

-- 2. Index unique pour éviter les doublons de produits dans le panier
CREATE UNIQUE INDEX "CartItem_userId_productId_key" ON "CartItem"("userId", "productId");

-- 3. Index composé haute performance pour les requêtes du panier (triées par date)
CREATE INDEX "CartItem_userId_updatedAt_idx" ON "CartItem"("userId", "updatedAt" DESC);

-- 4. Index simple sur productId
CREATE INDEX "CartItem_productId_idx" ON "CartItem"("productId");

-- 5. Clés étrangères avec Cascade (suppression automatique si l'utilisateur ou le produit est supprimé)
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- 6. Contrainte CHECK SQL inviolable pour la quantité
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_quantity_positive" CHECK (quantity > 0);

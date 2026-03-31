-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "isOnSale" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "originalPrice" DOUBLE PRECISION,
ADD COLUMN     "totalSales" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "Product_isOnSale_idx" ON "Product"("isOnSale");

-- CreateIndex
CREATE INDEX "Product_totalSales_idx" ON "Product"("totalSales");

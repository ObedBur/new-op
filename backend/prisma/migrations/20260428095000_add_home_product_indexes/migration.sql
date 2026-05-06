-- CreateIndex
CREATE INDEX "Product_isPublic_createdAt_idx" ON "Product"("isPublic", "createdAt");

-- CreateIndex
CREATE INDEX "Product_isOnSale_isPublic_createdAt_idx" ON "Product"("isOnSale", "isPublic", "createdAt");

-- CreateIndex
CREATE INDEX "Product_isPublic_totalSales_idx" ON "Product"("isPublic", "totalSales");

-- CreateIndex
CREATE INDEX "Product_categoryId_isPublic_createdAt_idx" ON "Product"("categoryId", "isPublic", "createdAt");

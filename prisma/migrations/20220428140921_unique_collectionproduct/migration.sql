/*
  Warnings:

  - A unique constraint covering the columns `[collectionId,sku]` on the table `CollectionProduct` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "autoindex_CollectionProduct_2" ON "CollectionProduct"("collectionId", "sku");

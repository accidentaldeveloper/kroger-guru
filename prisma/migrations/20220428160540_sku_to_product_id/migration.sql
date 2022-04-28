/*
  Warnings:

  - You are about to drop the column `upc` on the `CollectionProduct` table. All the data in the column will be lost.
  - Added the required column `productId` to the `CollectionProduct` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CollectionProduct" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "collectionId" TEXT NOT NULL,
    CONSTRAINT "CollectionProduct_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_CollectionProduct" ("collectionId", "createdAt", "id") SELECT "collectionId", "createdAt", "id" FROM "CollectionProduct";
DROP TABLE "CollectionProduct";
ALTER TABLE "new_CollectionProduct" RENAME TO "CollectionProduct";
CREATE UNIQUE INDEX "unique_index_CollectionProduct" ON "CollectionProduct"("collectionId", "productId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CollectionProduct" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sku" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "collectionId" TEXT NOT NULL,
    CONSTRAINT "CollectionProduct_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_CollectionProduct" ("collectionId", "id", "sku") SELECT "collectionId", "id", "sku" FROM "CollectionProduct";
DROP TABLE "CollectionProduct";
ALTER TABLE "new_CollectionProduct" RENAME TO "CollectionProduct";
CREATE UNIQUE INDEX "unique_index_CollectionProduct" ON "CollectionProduct"("collectionId", "sku");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

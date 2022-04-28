-- RedefineIndex
DROP INDEX "autoindex_CollectionProduct_2";
CREATE UNIQUE INDEX "unique_index_CollectionProduct" ON "CollectionProduct"("collectionId", "sku");

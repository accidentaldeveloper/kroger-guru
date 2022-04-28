import type { User, Collection, CollectionProduct } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Collection } from "@prisma/client";

export function getCollection({
  id,
  userId,
}: Pick<Collection, "id"> & {
  userId: User["id"];
}) {
  return prisma.collection.findFirst({
    where: { id, userId },
    include: { products: true },
  });
}

export function getCollectionListItems({ userId }: { userId: User["id"] }) {
  return prisma.collection.findMany({
    where: { userId },
    select: { id: true, title: true },
    orderBy: { updatedAt: "desc" },
  });
}

export function createCollection({
  body,
  title,
  userId,
}: Pick<Collection, "body" | "title"> & {
  userId: User["id"];
}) {
  return prisma.collection.create({
    data: {
      title,
      body,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export function deleteCollection({
  id,
  userId,
}: Pick<Collection, "id"> & { userId: User["id"] }) {
  return prisma.collection.deleteMany({
    where: { id, userId },
  });
}

export async function addProductToCollection({
  collectionId,
  userId,
  upc,
}: { collectionId: Collection["id"] } & { userId: User["id"] } & {
  upc: CollectionProduct["upc"];
}) {
  // Need to check for ownership before adding product
  const matchingCollection = await prisma.collection.findFirst({
    where: { id: collectionId, userId },
  });
  if (!matchingCollection) {
    throw Error("Collection not available to update");
  }
  return prisma.collectionProduct.upsert({
    where: {
      collectionId_upc: { collectionId, upc },
    },
    update: {},
    create: {
      collectionId,
      upc,
    },
  });
}

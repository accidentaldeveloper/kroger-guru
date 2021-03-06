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
    where: {
      OR: [
        { id, userId },
        { id, isPublic: true },
      ],
    },
    include: { products: { orderBy: { createdAt: "asc" } }, user: true },
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

export function setCollectionVisibility({
  id,
  userId,
  isPublic,
}: Pick<Collection, "id" | "isPublic"> & { userId: User["id"] }) {
  return prisma.collection.updateMany({
    where: { id, userId },
    data: { isPublic },
  });
}

export async function addProduct({
  collectionId,
  userId,
  productId,
}: { collectionId: Collection["id"] } & { userId: User["id"] } & {
  productId: CollectionProduct["productId"];
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
      collectionId_productId: { collectionId, productId },
    },
    update: {},
    create: {
      collectionId,
      productId,
    },
  });
}

export async function removeProduct({
  collectionId,
  userId,
  productId,
}: { collectionId: Collection["id"] } & { userId: User["id"] } & {
  productId: CollectionProduct["productId"];
}) {
  // Need to check for ownership before adding product
  const matchingCollection = await prisma.collection.findFirst({
    where: { id: collectionId, userId },
  });
  if (!matchingCollection) {
    throw Error("Collection not available to update");
  }
  return prisma.collectionProduct.delete({
    where: {
      collectionId_productId: { collectionId, productId },
    },
  });
}

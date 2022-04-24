import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import type { Collection } from "~/models/collection.server";
import { deleteCollection } from "~/models/collection.server";
import { getCollection } from "~/models/collection.server";
import { requireUserId } from "~/session.server";

type LoaderData = {
  collection: Collection;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  invariant(params.collectionId, "collectionId not found");

  const collection = await getCollection({ userId, id: params.collectionId });
  if (!collection) {
    throw new Response("Not Found", { status: 404 });
  }
  return json<LoaderData>({ collection });
};

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  invariant(params.collectionId, "collectionId not found");

  await deleteCollection({ userId, id: params.collectionId });

  return redirect("/collections");
};

export default function CollectionDetailsPage() {
  const data = useLoaderData() as LoaderData;

  return (
    <div>
      <h3 className="text-2xl font-bold">{data.collection.title}</h3>
      <p className="py-6">{data.collection.body}</p>
      <hr className="my-4" />
      <Form method="post">
        <button
          type="submit"
          className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Delete
        </button>
      </Form>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Collection not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}

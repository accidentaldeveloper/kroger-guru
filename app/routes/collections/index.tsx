import { Link } from "@remix-run/react";

export default function CollectionIndexPage() {
  return (
    <p>
      No collection selected. Select a collection on the left, or{" "}
      <Link to="new" className="text-blue-500 underline">
        create a new collection.
      </Link>
    </p>
  );
}

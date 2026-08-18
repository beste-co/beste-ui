import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchResults } from "./search-results";

export const metadata: Metadata = {
  title: "Search - Beste UI",
  description:
    "Search across every block, page, piece, and component by name or natural language.",
  // Query pages are per-user and infinite; keep them out of the index.
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
      <Suspense fallback={null}>
        <SearchResults />
      </Suspense>
    </div>
  );
}

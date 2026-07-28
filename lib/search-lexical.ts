// Client-safe substring matcher shared by the three listing search boxes
// (blocks / pieces / components). Kept separate from lib/search-core.ts, which
// is server-only and pulls in the embedding model. `q` is expected already
// trimmed + lowercased by the caller (matches the existing debounce pipeline).
export interface SearchableMeta {
  name: string;
  title: string;
  description: string;
  category: string;
}

export function matchesQuery(meta: SearchableMeta, q: string): boolean {
  return (
    meta.name.toLowerCase().includes(q) ||
    meta.title.toLowerCase().includes(q) ||
    meta.description.toLowerCase().includes(q) ||
    meta.category.toLowerCase().includes(q)
  );
}

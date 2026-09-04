import "server-only";
import { blocks } from "@/lib/blocks";
import { components } from "@/lib/components";
import { registryComponents } from "@/lib/registry-components";
import { matchesQuery } from "@/lib/search-lexical";
import type { AssetType } from "@/lib/search-index";

/**
 * Public-build search: lexical only.
 *
 * The private build runs a local embedding model over a committed vector index
 * for natural-language queries. Neither ships here (a 33 MB model and an index
 * built over the paid catalog), so this matches on name, title, description and
 * category instead. The route and the ⌘K palette call the same function with
 * the same result shape and don't know the difference.
 */

export interface SearchHit {
  type: AssetType;
  name: string;
  title: string;
  description: string;
  category: string;
  isPro: boolean;
  href: string;
  score: number;
  source: "lexical" | "semantic" | "both";
}

export interface SearchOpts {
  types?: AssetType[];
  limit?: number;
}

const HREF_PREFIX: Record<AssetType, string> = {
  block: "/block",
  piece: "/piece",
  component: "/component",
  // `AssetType` keeps "page" so callers passing `types: ["page"]` still
  // typecheck; CATALOGS below has no pages tier, so nothing is ever built
  // from this prefix in the public build.
  page: "/page",
};

interface CatalogEntry {
  name: string;
  title: string;
  description: string;
  category: string;
}

const CATALOGS: { type: AssetType; entries: CatalogEntry[] }[] = [
  { type: "block", entries: blocks as unknown as CatalogEntry[] },
  { type: "piece", entries: components as unknown as CatalogEntry[] },
  { type: "component", entries: registryComponents as unknown as CatalogEntry[] },
];

/** An exact name match should outrank a word buried in a description. */
function score(entry: CatalogEntry, q: string): number {
  const name = entry.name.toLowerCase();
  if (name === q) return 1;
  if (name.startsWith(q)) return 0.9;
  if (entry.title.toLowerCase().includes(q)) return 0.7;
  if (entry.category.toLowerCase().includes(q)) return 0.5;
  return 0.3;
}

export async function hybridSearch(query: string, opts: SearchOpts = {}): Promise<SearchHit[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const wanted = opts.types;
  const hits: SearchHit[] = [];

  for (const { type, entries } of CATALOGS) {
    if (wanted && !wanted.includes(type)) continue;

    for (const entry of entries) {
      if (!matchesQuery(entry, q)) continue;
      hits.push({
        type,
        name: entry.name,
        title: entry.title,
        description: entry.description,
        category: entry.category,
        isPro: false,
        href: `${HREF_PREFIX[type]}/${entry.name}`,
        score: score(entry, q),
        source: "lexical",
      });
    }
  }

  // Name as the tiebreaker keeps the order stable between identical scores.
  hits.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));

  return hits.slice(0, opts.limit ?? 20);
}

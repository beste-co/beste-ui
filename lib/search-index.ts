import "server-only";
import { blocks } from "@/lib/blocks";
import { components } from "@/lib/components";
import { registryComponents } from "@/lib/registry-components";

/**
 * Public-build item index, without the semantic part.
 *
 * The private build ranks by a committed embedding index, which is 1.8 MB of
 * vectors covering the whole catalog including paid descriptions, so it isn't
 * published. Relatedness here falls back to what it was before embeddings:
 * neighbors from the same category. Different ordering, same shape, and every
 * consumer is untouched.
 */

export type AssetType = "block" | "piece" | "component" | "page";

export interface IndexItem {
  type: AssetType;
  name: string;
  title: string;
  description: string;
  category: string;
  isPro: boolean;
  href: string;
}

export interface RelatedOpts {
  limit?: number;
  types?: AssetType[];
  sameCategoryOnly?: boolean;
}

const HREF_PREFIX: Record<AssetType, string> = {
  block: "/block",
  piece: "/piece",
  component: "/component",
  page: "/page",
};

interface CatalogEntry {
  name: string;
  title: string;
  description: string;
  category: string;
}

function catalog(type: AssetType): CatalogEntry[] {
  if (type === "block") return blocks as unknown as CatalogEntry[];
  if (type === "piece") return components as unknown as CatalogEntry[];
  if (type === "page") return []; // no pages tier in the public build
  return registryComponents as unknown as CatalogEntry[];
}

function toItem(type: AssetType, entry: CatalogEntry): IndexItem {
  return {
    type,
    name: entry.name,
    title: entry.title,
    description: entry.description,
    category: entry.category,
    isPro: false,
    href: `${HREF_PREFIX[type]}/${entry.name}`,
  };
}

/**
 * The whole catalogue as flat items. The private build dequantizes a committed
 * vector index here; this just walks the generated indexes, which is all the
 * callers that enumerate items (the MCP server) ever needed from it.
 */
export function loadIndex(): { items: IndexItem[] } {
  const items: IndexItem[] = [];

  for (const type of ["block", "piece", "component"] as const) {
    for (const entry of catalog(type)) {
      items.push(toItem(type, entry));
    }
  }

  return { items };
}

export function getRelated(type: AssetType, name: string, opts: RelatedOpts = {}): IndexItem[] {
  const limit = opts.limit ?? 6;
  const types = opts.types ?? [type];
  const self = catalog(type).find((entry) => entry.name === name);

  const results: IndexItem[] = [];

  for (const candidateType of types) {
    const pool = catalog(candidateType).filter((entry) => {
      if (candidateType === type && entry.name === name) return false;
      if (opts.sameCategoryOnly && self) return entry.category === self.category;
      return true;
    });

    // A deterministic window around the item, so a page renders the same
    // neighbors on every request and across a rebuild.
    const anchor = Math.max(
      0,
      pool.findIndex((entry) => entry.name === name)
    );
    const start = Math.max(0, Math.min(anchor, pool.length - limit));

    for (const entry of pool.slice(start, start + limit)) {
      results.push(toItem(candidateType, entry));
    }
  }

  return results.slice(0, limit);
}

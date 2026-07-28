// Runtime name -> last-changed date maps, derived from the changelog.
// Reused for JSON-LD `dateModified` on detail pages so the "last updated"
// signal matches what the sitemap already publishes (same source of truth).
// Changelog entries are newest-first, so the first occurrence of a name wins.
import { changelog } from "@/data/changelog";

type DateMap = Map<string, string>;

let cached: { blocks: DateMap; pieces: DateMap; components: DateMap } | null = null;

function build() {
  const blocks: DateMap = new Map();
  const pieces: DateMap = new Map();
  const components: DateMap = new Map();
  for (const entry of changelog) {
    for (const b of entry.blocks) if (!blocks.has(b.name)) blocks.set(b.name, entry.date);
    for (const p of entry.pieces) if (!pieces.has(p.name)) pieces.set(p.name, entry.date);
    for (const c of entry.components) if (!components.has(c.name)) components.set(c.name, entry.date);
  }
  return { blocks, pieces, components };
}

function maps() {
  if (!cached) cached = build();
  return cached;
}

export function getBlockDate(name: string): string | undefined {
  return maps().blocks.get(name);
}

export function getPieceDate(name: string): string | undefined {
  return maps().pieces.get(name);
}

export function getComponentDate(name: string): string | undefined {
  return maps().components.get(name);
}

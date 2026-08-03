// Runtime name -> date maps, derived from the changelog.
//
// Two dates per catalogue: the last one an entry mentions a name (reused for
// JSON-LD `dateModified` on detail pages, so the "last updated" signal matches
// what the sitemap already publishes) and the first one it does (the day the
// thing shipped, which is what a listing means by "newest" and what earns a card
// its NEW badge).
//
// Changelog entries are newest-first, so the first occurrence of a name wins the
// "changed" map and the last occurrence wins the "added" one.
import { changelog } from "@/data/changelog";

type DateMap = Map<string, string>;

interface Maps {
  changed: { blocks: DateMap; pieces: DateMap; components: DateMap };
  added: { blocks: DateMap; pieces: DateMap; components: DateMap };
}

let cached: Maps | null = null;

function build(): Maps {
  const changed = {
    blocks: new Map() as DateMap,
    pieces: new Map() as DateMap,
    components: new Map() as DateMap,
  };
  const added = {
    blocks: new Map() as DateMap,
    pieces: new Map() as DateMap,
    components: new Map() as DateMap,
  };

  for (const entry of changelog) {
    for (const b of entry.blocks) {
      if (!changed.blocks.has(b.name)) changed.blocks.set(b.name, entry.date);
      added.blocks.set(b.name, entry.date);
    }
    for (const p of entry.pieces) {
      if (!changed.pieces.has(p.name)) changed.pieces.set(p.name, entry.date);
      added.pieces.set(p.name, entry.date);
    }
    for (const c of entry.components) {
      if (!changed.components.has(c.name)) changed.components.set(c.name, entry.date);
      added.components.set(c.name, entry.date);
    }
  }

  return { changed, added };
}

function maps(): Maps {
  if (!cached) cached = build();
  return cached;
}

export function getBlockDate(name: string): string | undefined {
  return maps().changed.blocks.get(name);
}

export function getPieceDate(name: string): string | undefined {
  return maps().changed.pieces.get(name);
}

export function getComponentDate(name: string): string | undefined {
  return maps().changed.components.get(name);
}

/**
 * The day something first shipped, which is what "newest" means to someone
 * browsing: a block reworked last week is not a new block. Undefined for
 * anything the changelog never recorded — a couple of dozen blocks from before
 * the log existed, and most of the pieces catalogue.
 */
export function getBlockAddedDate(name: string): string | undefined {
  return maps().added.blocks.get(name);
}

export function getPieceAddedDate(name: string): string | undefined {
  return maps().added.pieces.get(name);
}

export function getComponentAddedDate(name: string): string | undefined {
  return maps().added.components.get(name);
}

/**
 * Ship dates for what was added recently, as a plain object a page can hand to a
 * client component. The changelog itself never can: it reaches the live
 * registry, so only the handful of dates a card might need crosses over.
 *
 * The window is wider than the one the badge uses (see `NEW_FOR_MS`). These
 * pages are rendered once and served until the next build, so the card is told
 * the date and works out for itself whether it is still new; a fixed window
 * baked in at build time would keep a badge up for as long as the deploy lasted.
 */
function recentDates(source: DateMap, days: number, today: Date): Record<string, string> {
  const cutoff = new Date(today.getTime() - days * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const recent: Record<string, string> = {};
  for (const [name, date] of source) {
    if (date >= cutoff) recent[name] = date;
  }
  return recent;
}

export function recentBlockDates(days = 14, today: Date = new Date()): Record<string, string> {
  return recentDates(maps().added.blocks, days, today);
}

export function recentPieceDates(days = 14, today: Date = new Date()): Record<string, string> {
  return recentDates(maps().added.pieces, days, today);
}

export function recentComponentDates(days = 14, today: Date = new Date()): Record<string, string> {
  return recentDates(maps().added.components, days, today);
}

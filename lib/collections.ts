// The studio sets, as something a reader can browse.
//
// `block-sets.ts` is generated and answers only "which blocks belong to which
// set". This file is the hand-written half: what each set is called on the site,
// what it says about itself, and the lookups the listing pages need.
//
// A collection page names its studio in its own title and description, which is
// the point of the page. That is not the rule the blocks live under: a block's
// own meta still never carries the set name, since a set is an internal label
// and has no business in a card title or a search snippet.
//
// Deliberately free of any `@/lib/blocks` import: the filter bar is a client
// component, and pulling the live registry in behind it would ship the whole
// unobfuscated catalogue to the browser.
import { BLOCK_SETS, type BlockSet } from "@/lib/block-sets";

export interface CollectionInfo {
  /** The URL segment, e.g. "auralis" in /blocks/collection/auralis. */
  slug: BlockSet;
  label: string;
  /** The sentence under the title, and what the picker is choosing between. */
  description: string;
  metaTitle: string;
  metaDescription: string;
  count: number;
}

const COLLECTION_COPY: Record<BlockSet, Omit<CollectionInfo, "slug" | "count">> = {
  auralis: {
    label: "Auralis",
    description:
      "Oversized display type on monochrome surfaces, with a monospace parenthetical eyebrow and a pill CTA that carries its own seal. Editorial layouts for studio, agency and portfolio sites.",
    metaTitle: "Auralis collection - Beste UI",
    metaDescription:
      "The Auralis collection: monochrome, big-type shadcn/tailwind blocks with editorial layouts. Heroes, features, footers and more that share one design language.",
  },
  polaris: {
    label: "Polaris",
    description:
      "A square accent eyebrow over bold uppercase labels, hairline rules under every section header, and a two-tone seal button. Structured, high-contrast layouts for creative studios.",
    metaTitle: "Polaris collection - Beste UI",
    metaDescription:
      "The Polaris collection: high-contrast shadcn/tailwind blocks with accent eyebrows, hairline section rules and seal buttons. Navbars, heroes, workflows, careers and more.",
  },
  sirius: {
    label: "Sirius",
    description:
      "Light-weight display headings on white, a single accent colour, and media tiles that float a live piece of product UI. Calm, spacious pages for a modern SaaS.",
    metaTitle: "Sirius collection - Beste UI",
    metaDescription:
      "The Sirius collection: light, spacious shadcn/tailwind blocks for product marketing. Light-weight headings, one accent colour and media tiles floating real UI assets.",
  },
};

/** Every collection, in the order the picker lists them. */
export const COLLECTIONS: readonly CollectionInfo[] = (
  Object.keys(COLLECTION_COPY) as BlockSet[]
)
  .map((slug) => ({ slug, ...COLLECTION_COPY[slug], count: BLOCK_SETS[slug].length }))
  .sort((a, b) => a.label.localeCompare(b.label));

export function getCollection(slug: string): CollectionInfo | undefined {
  return COLLECTIONS.find((c) => c.slug === slug);
}

/**
 * Which collection a block belongs to, if any. Built once: a listing page asks
 * this of every block it counts.
 */
export const COLLECTION_BY_BLOCK: ReadonlyMap<string, BlockSet> = new Map(
  COLLECTIONS.flatMap((c) => BLOCK_SETS[c.slug].map((name) => [name, c.slug] as const))
);

/** The names in a collection, as a Set for repeated membership tests. */
export function collectionBlockNames(slug: string): ReadonlySet<string> {
  const collection = getCollection(slug);
  return new Set(collection ? BLOCK_SETS[collection.slug] : []);
}

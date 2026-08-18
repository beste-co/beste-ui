// Lightweight tag archives, from two sources.
//
// 1. The per-category `keywords` already defined in category-info.ts. A keyword
//    only becomes an archive page when it appears in TWO OR MORE categories --
//    a single-category tag would just duplicate that category page
//    (thin/duplicate content), whereas a cross-category tag is a genuinely new
//    hub that aggregates related blocks across categories (e.g. "showcase"
//    gathers use-case + product + bento).
//
// 2. A `tags` array on a block's own meta. Some sets share a mechanic rather
//    than a category -- the questionnaire blocks run from Education to Travel --
//    so no keyword could ever gather them. Those tags list exactly the blocks
//    that declare them, and they earn a page on their own because the curation
//    is explicit rather than inferred.
import { type BlockMeta, blocks } from "@/lib/blocks";
import { keywordTags, tagSlug } from "@/lib/tag-slugs";

export { tagSlug };

export interface TagInfo {
  slug: string;
  label: string; // human label, from the source keyword
  categories: string[]; // category slugs this tag spans
  /** Set when blocks declare the tag themselves; those blocks are the archive. */
  blocks?: string[];
}

/** A block's `category` as it appears in a category URL. */
function categorySlug(category: string): string {
  return category.toLowerCase().replace(/\s+/g, "-");
}

let cached: Map<string, TagInfo> | null = null;

function buildRegistry(): Map<string, TagInfo> {
  const result = new Map<string, TagInfo>();

  // 1. Category keywords, cross-category only. Shared with the sitemap
  //    generator, which cannot import this module.
  for (const tag of keywordTags()) {
    result.set(tag.slug, tag);
  }

  // 2. Tags declared on the blocks themselves. These win where the slugs
  //    collide: an explicit list of blocks is more precise than a category
  //    sweep, so the archive lists exactly what was curated.
  const fromBlocks = new Map<string, { label: string; cats: Set<string>; names: string[] }>();
  for (const block of blocks) {
    for (const keyword of block.tags ?? []) {
      const slug = tagSlug(keyword);
      if (!slug) continue;
      const existing = fromBlocks.get(slug);
      if (existing) {
        existing.cats.add(categorySlug(block.category));
        existing.names.push(block.name);
      } else {
        fromBlocks.set(slug, {
          label: keyword,
          cats: new Set([categorySlug(block.category)]),
          names: [block.name],
        });
      }
    }
  }

  for (const [slug, { label, cats, names }] of fromBlocks) {
    result.set(slug, {
      slug,
      label,
      categories: Array.from(cats).sort(),
      blocks: names,
    });
  }

  return result;
}

function registry(): Map<string, TagInfo> {
  if (!cached) cached = buildRegistry();
  return cached;
}

export function getAllTags(): TagInfo[] {
  return Array.from(registry().values()).sort((a, b) => a.label.localeCompare(b.label));
}

export function getTag(slug: string): TagInfo | undefined {
  return registry().get(slug);
}

/**
 * Tags that apply to a given category slug (for chips on detail/category
 * pages). Block-level tags are left out: only a handful of a category's blocks
 * carry one, so a chip on the category page would promise the whole category.
 */
export function getTagsForCategory(categorySlug: string): TagInfo[] {
  return getAllTags().filter((t) => !t.blocks && t.categories.includes(categorySlug));
}

/** The hubs a single block belongs to, for chips on its detail page. */
export function getTagsForBlock(name: string): TagInfo[] {
  return getAllTags().filter((t) => t.blocks?.includes(name));
}

/** The blocks a tag archives. */
export function getBlocksForTag(slug: string): BlockMeta[] {
  const tag = getTag(slug);
  if (!tag) return [];

  if (tag.blocks) {
    const names = new Set(tag.blocks);
    return blocks.filter((b) => names.has(b.name));
  }

  const cats = new Set(tag.categories);
  return blocks.filter((b) => cats.has(categorySlug(b.category)));
}

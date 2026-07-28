// Lightweight tag archives derived from the per-category `keywords` already
// defined in category-info.ts. No block-meta regeneration required.
//
// A tag only becomes an archive page when its keyword appears in TWO OR MORE
// categories -- a single-category tag would just duplicate that category page
// (thin/duplicate content), whereas a cross-category tag is a genuinely new
// hub that aggregates related blocks across categories (e.g. "showcase"
// gathers use-case + product + bento).
import { categoryInfoMap } from "@/lib/category-info";
import { type BlockMeta, blocks } from "@/lib/blocks";

export interface TagInfo {
  slug: string;
  label: string; // human label, from the source keyword
  categories: string[]; // category slugs this tag spans
}

export function tagSlug(keyword: string): string {
  return keyword
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

let cached: Map<string, TagInfo> | null = null;

function buildRegistry(): Map<string, TagInfo> {
  const acc = new Map<string, { label: string; cats: Set<string> }>();
  for (const [catSlug, info] of Object.entries(categoryInfoMap)) {
    if (catSlug === "all") continue; // "all" is the catch-all, not a real category
    for (const keyword of info.keywords) {
      const slug = tagSlug(keyword);
      if (!slug) continue;
      const existing = acc.get(slug);
      if (existing) {
        existing.cats.add(catSlug);
      } else {
        acc.set(slug, { label: keyword, cats: new Set([catSlug]) });
      }
    }
  }

  const result = new Map<string, TagInfo>();
  for (const [slug, { label, cats }] of acc) {
    if (cats.size < 2) continue; // only cross-category tags earn an archive page
    result.set(slug, { slug, label, categories: Array.from(cats).sort() });
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

/** Tags that apply to a given category slug (for chips on detail/category pages). */
export function getTagsForCategory(categorySlug: string): TagInfo[] {
  return getAllTags().filter((t) => t.categories.includes(categorySlug));
}

/** Every block whose category is one of the tag's categories. */
export function getBlocksForTag(slug: string): BlockMeta[] {
  const tag = getTag(slug);
  if (!tag) return [];
  const cats = new Set(tag.categories);
  return blocks.filter((b) => cats.has(b.category.toLowerCase().replace(/\s+/g, "-")));
}

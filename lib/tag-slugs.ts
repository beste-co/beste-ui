/**
 * The half of the tag registry that needs nothing but category metadata.
 *
 * `lib/tags.ts` pulls `lib/blocks`, and that pulls every block component in the
 * registry: fine inside the app, impossible in a build script that only wants a
 * list of slugs. These two live here so the sitemap generator can import them
 * without dragging 1935 React components in behind them, and so there is still
 * only one definition of what a tag slug is.
 *
 * Imported relatively rather than through `@/`: build scripts run outside
 * Next's resolver, where the alias is not guaranteed.
 */
import { categoryInfoMap } from "./category-info";

export function tagSlug(keyword: string): string {
  return keyword
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export interface KeywordTag {
  slug: string;
  label: string;
  categories: string[];
}

/**
 * Category keywords that appear in two or more categories.
 *
 * A keyword in a single category would only duplicate that category's own
 * page; one that spans several is a genuinely new hub.
 */
export function keywordTags(): KeywordTag[] {
  const found = new Map<string, { label: string; cats: Set<string> }>();

  for (const [catSlug, info] of Object.entries(categoryInfoMap)) {
    if (catSlug === "all") continue; // the catch-all, not a real category
    for (const keyword of info.keywords) {
      const slug = tagSlug(keyword);
      if (!slug) continue;
      const existing = found.get(slug);
      if (existing) existing.cats.add(catSlug);
      else found.set(slug, { label: keyword, cats: new Set([catSlug]) });
    }
  }

  return Array.from(found)
    .filter(([, { cats }]) => cats.size >= 2)
    .map(([slug, { label, cats }]) => ({
      slug,
      label,
      categories: Array.from(cats).sort(),
    }));
}

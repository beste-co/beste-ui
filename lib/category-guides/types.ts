import type { StackId } from "@/components/stack-logos";
import type { FaqEntry } from "@/lib/breadcrumb-jsonld";

/** Long-form copy under a category grid: a short guide plus a few questions. */
export interface CategoryGuide {
  /** Section heading, e.g. "Choosing a pricing block". */
  heading: string;
  /** The guide column: paragraphs, with an optional sub-heading and list. */
  intro: GuideBlock[];
  faqs: FaqEntry[];
  /** Three or four neighbouring categories, each with the reason to go there. */
  related: RelatedCategory[];
  /** Libraries shown as a row of logos; the shared default row when left out. */
  stack?: StackId[];
}

export interface RelatedCategory {
  kind: "blocks" | "components";
  /** Category slug under `/blocks/` or `/components/`. */
  slug: string;
  /** One or two sentences on why this category pairs with the current one. */
  reason: string;
}

/**
 * One piece of the guide. Strings are paragraphs, and every string (list items and
 * FAQ answers too) may carry `[label](/blocks/slug)` or `[label](/components/slug)`
 * links and `**bold**` phrases.
 */
export type GuideBlock = string | { heading: string } | { list: string[] };

/** Keyed by category slug (`categorySlug`), e.g. `real-estate`. */
export type CategoryGuideMap = Record<string, CategoryGuide>;

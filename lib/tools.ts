/**
 * Public-build tools registry: empty on purpose.
 *
 * The free tools at /tools are a traffic surface for the hosted site rather
 * than part of the component library, so their routes, components and copy stay
 * private (see EXCLUDED_APP_PATHS in allowlist.ts). This keeps the module's
 * exported shape so the sitemap and llms.txt generators import it as usual and
 * simply find nothing to list.
 */

export type ToolCategoryId = string;

export interface ToolFaq {
  question: string;
  answer: string;
}

export interface ToolMeta {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  category: ToolCategoryId;
  keywords: string[];
  faq: ToolFaq[];
  related?: string[];
  cta?: { label: string; href: string };
  isNew?: boolean;
  added: string;
}

export interface ToolCategoryInfo {
  id: ToolCategoryId;
  title: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
}

export const TOOL_CATEGORIES: readonly ToolCategoryInfo[] = [];
export const tools: readonly ToolMeta[] = [];

export function getTool(_slug: string): ToolMeta | undefined {
  return undefined;
}

export function getToolCategory(_id: string): ToolCategoryInfo | undefined {
  return undefined;
}

export function getToolsByCategory(_id: ToolCategoryId): ToolMeta[] {
  return [];
}

export function getPopulatedCategories(): ToolCategoryInfo[] {
  return [];
}

export function getRelatedTools(_meta: ToolMeta, _limit = 3): ToolMeta[] {
  return [];
}

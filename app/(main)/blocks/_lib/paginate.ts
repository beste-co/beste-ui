import type { BlockMeta } from "@/lib/blocks";

export const PAGE_SIZE = 24;

export interface CategoryCount {
  category: string;
  slug: string;
  count: number;
}

export function categorySlug(category: string): string {
  return category.toLowerCase().replace(/\s+/g, "-");
}

export function filterByCategorySlug(
  items: readonly BlockMeta[],
  slug: string | undefined
): readonly BlockMeta[] {
  if (!slug) return items;
  return items.filter((b) => categorySlug(b.category) === slug);
}

export interface PageResult<T> {
  items: readonly T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

export function paginate<T>(
  items: readonly T[],
  page: number,
  pageSize: number = PAGE_SIZE
): PageResult<T> {
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    currentPage,
    totalPages,
    totalItems,
  };
}

export function buildCategoryCounts(
  items: readonly BlockMeta[]
): CategoryCount[] {
  const counts = new Map<string, number>();
  for (const b of items) {
    counts.set(b.category, (counts.get(b.category) ?? 0) + 1);
  }
  return Array.from(counts, ([category, count]) => ({
    category,
    slug: categorySlug(category),
    count,
  })).sort((a, b) => a.category.localeCompare(b.category));
}

export function parsePage(value: string | string[] | undefined): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number.parseInt(raw ?? "1", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

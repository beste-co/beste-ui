"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useCallback, useMemo, useTransition } from "react";
import { BlocksGrid } from "@/components/blocks-grid";
import {
  BrowseFilters,
  BrowsePagerArrow,
  BrowsePagination,
} from "@/components/browse-filters";
import type { BlockMeta } from "@/lib/blocks";
import { blocksObfuscated as blocks } from "@/lib/blocks-obfuscated";
import { type BrowseSort, DEFAULT_SORT, SORT_OPTIONS } from "@/lib/browse-sort";
import { COLLECTIONS, COLLECTION_BY_BLOCK, getCollection } from "@/lib/collections";
import { type CategoryCount, categorySlug } from "./_lib/paginate";

interface BlocksListingProps {
  itemNames: readonly string[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  currentCategory: string | undefined;
  currentCategorySlug: string | undefined;
  /** The collection in force, by slug, on a /blocks/collection/<slug> page. */
  currentCollectionSlug?: string;
  /** The order the server sorted `itemNames` into. */
  currentSort?: BrowseSort;
  /** Ship dates for recently added blocks, for the cards' NEW badge. */
  addedDates?: Readonly<Record<string, string>>;
  categories: readonly CategoryCount[];
  pageSize: number;
  /**
   * The sentence under the title. Passed in rather than written here so a
   * category page says something about that category — the same thing its meta
   * description says — instead of the one line every category shared.
   */
  description?: string;
}

/**
 * The three controls as a path: /blocks/hero, /blocks/collection/auralis,
 * /blocks/collection/auralis?category=hero&sort=name.
 *
 * The collection and the category pick the route; the sort is only ever a query,
 * and the default one is left off so the plain URL stays the canonical one.
 */
function browseHref(
  collection: string | null,
  category: string | null,
  sort: BrowseSort = DEFAULT_SORT
): string {
  const path = collection ? `/blocks/collection/${collection}` : category ? `/blocks/${category}` : "/blocks";
  const params = new URLSearchParams();
  if (collection && category) params.set("category", category);
  if (sort !== DEFAULT_SORT) params.set("sort", sort);
  const query = params.toString();
  return query ? `${path}?${query}` : path;
}

function buildPageHref(basePath: string, page: number): string {
  if (page <= 1) return basePath;
  const sep = basePath.includes("?") ? "&" : "?";
  return `${basePath}${sep}page=${page}`;
}

export function BlocksListing({
  itemNames,
  currentPage,
  totalPages,
  totalItems,
  currentCategory,
  currentCategorySlug,
  currentCollectionSlug,
  currentSort = DEFAULT_SORT,
  addedDates,
  categories,
  pageSize,
  description,
}: BlocksListingProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const gridItems = useMemo<readonly BlockMeta[]>(() => {
    const map = new Map(blocks.map((b) => [b.name, b]));
    return itemNames.map((name) => map.get(name)).filter((b): b is BlockMeta => Boolean(b));
  }, [itemNames]);

  const handleCategoryChange = useCallback(
    (slug: string | null) => {
      startTransition(() =>
        router.push(browseHref(currentCollectionSlug ?? null, slug, currentSort))
      );
    },
    [router, currentCollectionSlug, currentSort]
  );

  const handleCollectionChange = useCallback(
    (slug: string | null) => {
      startTransition(() =>
        router.push(browseHref(slug, currentCategorySlug ?? null, currentSort))
      );
    },
    [router, currentCategorySlug, currentSort]
  );

  const handleSortChange = useCallback(
    (value: string | null) => {
      const sort = (value ?? DEFAULT_SORT) as BrowseSort;
      startTransition(() =>
        router.push(
          browseHref(currentCollectionSlug ?? null, currentCategorySlug ?? null, sort)
        )
      );
    },
    [router, currentCollectionSlug, currentCategorySlug]
  );

  /** The categories in the shape the filter bar takes them. */
  const filterOptions = useMemo(
    () => categories.map((c) => ({ label: c.category, value: c.slug, count: c.count })),
    [categories]
  );

  /*
   * How many blocks each collection would leave you with from here: on a
   * category page the count is that category's share of the collection, so
   * picking one never lands on a page that says "no blocks".
   */
  const collectionOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const b of blocks) {
      const collection = COLLECTION_BY_BLOCK.get(b.name);
      if (!collection) continue;
      if (currentCategorySlug && categorySlug(b.category) !== currentCategorySlug) continue;
      counts.set(collection, (counts.get(collection) ?? 0) + 1);
    }
    return COLLECTIONS.map((c) => ({
      label: c.label,
      value: c.slug,
      count: counts.get(c.slug) ?? 0,
    })).filter((c) => c.count > 0);
  }, [currentCategorySlug]);

  const collection = currentCollectionSlug ? getCollection(currentCollectionSlug) : undefined;

  /** Everything the collection picker is not filtering, i.e. the category scope. */
  const uncollectedCount = useMemo(
    () =>
      currentCategorySlug
        ? blocks.filter((b) => categorySlug(b.category) === currentCategorySlug).length
        : blocks.length,
    [currentCategorySlug]
  );

  /** What sits after "Blocks /" in the title: the collection, then the category. */
  const trail = [
    collection
      ? { label: collection.label, href: browseHref(collection.slug, null, currentSort) }
      : null,
    currentCategory
      ? {
          label: currentCategory,
          href: browseHref(currentCollectionSlug ?? null, currentCategorySlug ?? null, currentSort),
        }
      : null,
  ].filter((segment): segment is { label: string; href: string } => segment !== null);

  const showPagination = totalPages > 1;
  const rangeStart = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const rangeEnd = Math.min(currentPage * pageSize, totalItems);
  // Page 2 has to carry the category and the sort with it: the pathname alone
  // would silently widen the list back out and reorder it.
  const basePath = browseHref(
    currentCollectionSlug ?? null,
    currentCategorySlug ?? null,
    currentSort
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
      <header className="mb-10 md:mb-12">
        {/*
          The count is centred against the title rather than sat on its baseline:
          its parentheses are drawn taller than the digits and hang below the
          line, so a shared baseline left the whole group reading as dropped.
        */}
        <h1 className="flex flex-wrap items-center gap-x-3 text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
          <span>
            {trail.length > 0 ? (
              <>
                <Link
                  href="/blocks"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Blocks
                </Link>
                {trail.map((segment, index) => (
                  <Fragment key={segment.href}>
                    <span className="mx-2 text-muted-foreground">/</span>
                    {/* Only the ones you can still step back to are links; the
                        last segment is where you already are. */}
                    {index < trail.length - 1 ? (
                      <Link
                        href={segment.href}
                        className="text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {segment.label}
                      </Link>
                    ) : (
                      segment.label
                    )}
                  </Fragment>
                ))}
              </>
            ) : (
              "Blocks"
            )}
          </span>
          <span className="text-2xl font-semibold text-primary md:text-3xl">({totalItems})</span>
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground md:text-xl">
          {description ??
            "A library of production-ready React blocks built with Tailwind CSS and shadcn/ui. Copy, paste, and customize for your next project."}
        </p>
      </header>

      {/* No search field: the site's own search (⌘K, and /ai/search behind it)
          already looks across blocks, pieces and components, and a second one
          scoped to this page competed with it while finding less. */}
      <BrowseFilters
        options={filterOptions}
        value={currentCategorySlug ?? null}
        onValueChange={handleCategoryChange}
        allCount={collection?.count ?? blocks.length}
        label="Category"
        extra={[
          // A category no collection reaches (Coming Soon pages, say) gets the
          // bar without it: a picker with nothing to pick is furniture.
          ...(collectionOptions.length > 0
            ? [
                {
                  options: collectionOptions,
                  value: currentCollectionSlug ?? null,
                  onValueChange: handleCollectionChange,
                  allLabel: "All collections",
                  allCount: uncollectedCount,
                  label: "Collection",
                },
              ]
            : []),
          {
            options: SORT_OPTIONS.map((o) => ({ label: o.label, value: o.value })),
            value: currentSort,
            onValueChange: handleSortChange,
            label: "Sort",
            allowAll: false,
          },
        ]}
        disabled={isPending}
      >
          <p className="text-base text-muted-foreground">
            {totalItems === 0 ? "No blocks" : `${rangeStart}–${rangeEnd} of ${totalItems}`}
          </p>
          {showPagination && (
            <div className="flex items-center gap-1">
              <BrowsePagerArrow
                direction="prev"
                label="Previous page"
                href={currentPage > 1 ? buildPageHref(basePath, currentPage - 1) : undefined}
              />
              <BrowsePagerArrow
                direction="next"
                label="Next page"
                href={currentPage < totalPages ? buildPageHref(basePath, currentPage + 1) : undefined}
              />
            </div>
          )}
      </BrowseFilters>

      {gridItems.length === 0 ? (
        <div className="rounded-xl bg-muted/60 p-10 text-center text-base text-muted-foreground">
          No blocks in this category.
        </div>
      ) : (
        <BlocksGrid blocks={[...gridItems]} addedDates={addedDates} />
      )}

      {showPagination && (
        <BrowsePagination currentPage={currentPage} totalPages={totalPages} basePath={basePath} />
      )}
    </div>
  );
}

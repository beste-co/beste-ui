"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { BlocksGrid } from "@/components/blocks-grid";
import {
  BrowseFilters,
  BrowsePagerArrow,
  BrowsePagination,
} from "@/components/browse-filters";
import { type BlockMeta, blocks } from "@/lib/blocks";
import { matchesQuery } from "@/lib/search-lexical";
import { cn } from "@/lib/utils";
import type { CategoryCount } from "./_lib/paginate";

interface BlocksListingProps {
  itemNames: readonly string[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  currentCategory: string | undefined;
  currentCategorySlug: string | undefined;
  categories: readonly CategoryCount[];
  pageSize: number;
  /**
   * The sentence under the title. Passed in rather than written here so a
   * category page says something about that category — the same thing its meta
   * description says — instead of the one line every category shared.
   */
  description?: string;
}

const SEARCH_RESULT_CAP = 48;

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
  categories,
  pageSize,
  description,
}: BlocksListingProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [rawQuery, setRawQuery] = useState("");
  const [query, setQuery] = useState("");

  // Debounce rawQuery → query (200ms)
  useEffect(() => {
    const handle = setTimeout(() => setQuery(rawQuery.trim().toLowerCase()), 200);
    return () => clearTimeout(handle);
  }, [rawQuery]);

  const searchResults = useMemo<readonly BlockMeta[] | null>(() => {
    if (!query) return null;
    const matched: BlockMeta[] = [];
    for (const b of blocks) {
      if (matchesQuery(b, query)) {
        matched.push(b);
        if (matched.length >= SEARCH_RESULT_CAP) break;
      }
    }
    return matched;
  }, [query]);

  const searchTotal = useMemo(() => {
    if (!query) return 0;
    let total = 0;
    for (const b of blocks) if (matchesQuery(b, query)) total++;
    return total;
  }, [query]);

  const items = useMemo<readonly BlockMeta[]>(() => {
    const map = new Map(blocks.map((b) => [b.name, b]));
    return itemNames.map((name) => map.get(name)).filter((b): b is BlockMeta => Boolean(b));
  }, [itemNames]);

  const gridItems = searchResults ?? items;

  const handleCategoryChange = useCallback(
    (slug: string | null) => {
      const href = slug ? `/blocks/${slug}` : "/blocks";
      startTransition(() => router.push(href));
    },
    [router]
  );

  /** The categories in the shape the filter bar takes them. */
  const filterOptions = useMemo(
    () => categories.map((c) => ({ label: c.category, value: c.slug, count: c.count })),
    [categories]
  );

  const showPagination = !query && totalPages > 1;
  const rangeStart = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const rangeEnd = Math.min(currentPage * pageSize, totalItems);
  const basePath = pathname;

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
            {currentCategory ? (
              <>
                <Link
                  href="/blocks"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Blocks
                </Link>
                <span className="mx-2 text-muted-foreground">/</span>
                {currentCategory}
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

      <BrowseFilters
        query={rawQuery}
        onQueryChange={setRawQuery}
        searchPlaceholder="Search blocks…"
        searchLabel="Search blocks"
        options={filterOptions}
        value={currentCategorySlug ?? null}
        onValueChange={handleCategoryChange}
        allCount={blocks.length}
        disabled={isPending}
      >
          <p className="text-base text-muted-foreground">
            {query
              ? `${searchTotal} match${searchTotal === 1 ? "" : "es"}${
                  searchTotal > SEARCH_RESULT_CAP ? ` (showing first ${SEARCH_RESULT_CAP})` : ""
                }`
              : totalItems === 0
                ? "No blocks"
                : `${rangeStart}–${rangeEnd} of ${totalItems}`}
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
          {query ? `No blocks match "${rawQuery}".` : "No blocks in this category."}
        </div>
      ) : (
        <BlocksGrid blocks={[...gridItems]} searchQuery={rawQuery} />
      )}

      {showPagination && (
        <BrowsePagination currentPage={currentPage} totalPages={totalPages} basePath={basePath} />
      )}
    </div>
  );
}

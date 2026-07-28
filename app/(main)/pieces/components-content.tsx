"use client";

import { SourceCodeIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import {
  BrowseFilters,
  BrowsePagerArrow,
  BrowsePagination,
} from "@/components/browse-filters";
import { type ComponentMeta, components } from "@/lib/components";
import { matchesQuery } from "@/lib/search-lexical";
import { cn } from "@/lib/utils";
import type { CategoryCount } from "./_lib/paginate";

interface ComponentsContentProps {
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

export function ComponentsContent({
  itemNames,
  currentPage,
  totalPages,
  totalItems,
  currentCategory,
  currentCategorySlug,
  categories,
  pageSize,
  description,
}: ComponentsContentProps) {
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

  const searchResults = useMemo<readonly ComponentMeta[] | null>(() => {
    if (!query) return null;
    const matched: ComponentMeta[] = [];
    for (const c of components) {
      if (matchesQuery(c, query)) {
        matched.push(c);
        if (matched.length >= SEARCH_RESULT_CAP) break;
      }
    }
    return matched;
  }, [query]);

  const searchTotal = useMemo(() => {
    if (!query) return 0;
    let total = 0;
    for (const c of components) if (matchesQuery(c, query)) total++;
    return total;
  }, [query]);

  const items = useMemo<readonly ComponentMeta[]>(() => {
    const map = new Map(components.map((c) => [c.name, c]));
    return itemNames
      .map((name) => map.get(name))
      .filter((c): c is ComponentMeta => Boolean(c));
  }, [itemNames]);

  const gridItems = searchResults ?? items;

  const handleCategoryChange = useCallback(
    (slug: string | null) => {
      const href = slug ? `/pieces/${slug}` : "/pieces";
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
                  href="/pieces"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Pieces
                </Link>
                <span className="mx-2 text-muted-foreground">/</span>
                {currentCategory}
              </>
            ) : (
              "Pieces"
            )}
          </span>
          <span className="text-2xl font-semibold text-primary md:text-3xl">({totalItems})</span>
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground md:text-xl">
          {description ??
            "Compact, self-contained widgets that behave like assets. Drop them into any block, card, or page to add a small touch of polish without rewriting the surrounding UI."}
        </p>
      </header>

      <BrowseFilters
        query={rawQuery}
        onQueryChange={setRawQuery}
        searchPlaceholder="Search pieces…"
        searchLabel="Search pieces"
        options={filterOptions}
        value={currentCategorySlug ?? null}
        onValueChange={handleCategoryChange}
        allCount={components.length}
        disabled={isPending}
      >
          <p className="text-base text-muted-foreground">
            {query
              ? `${searchTotal} match${searchTotal === 1 ? "" : "es"}${
                  searchTotal > SEARCH_RESULT_CAP ? ` (showing first ${SEARCH_RESULT_CAP})` : ""
                }`
              : totalItems === 0
                ? "No pieces"
                : `${rangeStart}–${rangeEnd} of ${totalItems}`}
          </p>
          {showPagination && (
            <div className="flex items-center gap-1">
              <BrowsePagerArrow
                direction="prev"
                label="Previous page"
                href={currentPage > 1 ? buildPageHref(pathname, currentPage - 1) : undefined}
              />
              <BrowsePagerArrow
                direction="next"
                label="Next page"
                href={currentPage < totalPages ? buildPageHref(pathname, currentPage + 1) : undefined}
              />
            </div>
          )}
      </BrowseFilters>

      {gridItems.length === 0 ? (
        <div className="rounded-lg border border-dashed p-10 text-center text-base text-muted-foreground">
          {query ? `No pieces match "${rawQuery}".` : "No pieces in this category."}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {gridItems.map((c) => {
            const Component = c.component;
            return (
              /*
                The whole card is a link, and the link is a sibling of the card's
                contents rather than their ancestor: a piece demo can contain its own
                anchors, and a parser will not keep one anchor inside another.
              */
              <div
                key={c.name}
                className="group relative flex flex-col gap-3 rounded-xl bg-muted p-3 transition-colors hover:bg-muted-foreground/15 has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-ring"
              >
                <Link
                  href={`/piece/${c.name}`}
                  aria-label={c.title}
                  className="absolute inset-0 z-10 rounded-xl outline-none"
                />
                <div
                  className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-md bg-background"
                  style={{
                    backgroundImage: "radial-gradient(circle, var(--border) 1px, transparent 1px)",
                    backgroundSize: "16px 16px",
                  }}
                >
                  <Component {...c.demoProps} />
                  <div
                    className="pointer-events-none absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-md border bg-background opacity-0 transition-opacity group-hover:opacity-100"
                    aria-hidden="true"
                  >
                    <HugeiconsIcon icon={SourceCodeIcon} size={14} strokeWidth={2} />
                  </div>
                </div>
                {/* Title alone: the registry name is what you type into a terminal,
                    not what you scan a grid for, and the overlay above already carries
                    the accessible name. */}
                <div className="relative flex flex-col gap-1 px-1 pb-1">
                  <h3 className="text-base font-semibold tracking-tight">{c.title}</h3>
                  <p className="line-clamp-2 text-base text-muted-foreground">{c.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showPagination && (
        <BrowsePagination currentPage={currentPage} totalPages={totalPages} basePath={pathname} />
      )}

    </div>
  );
}

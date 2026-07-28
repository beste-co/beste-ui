"use client";

import { SourceCodeIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { FitScale } from "@/components/fit-scale";
import {
  BrowseFilters,
  BrowsePagerArrow,
  BrowsePagination,
} from "@/components/browse-filters";
import { FRAME_PREVIEW_CATEGORIES } from "@/lib/registry-component-preview";
import { type RegistryComponentMeta, registryComponents } from "@/lib/registry-components";
import { matchesQuery } from "@/lib/search-lexical";
import { cn } from "@/lib/utils";
import type { CategoryCount } from "./_lib/paginate";

interface RegistryComponentsContentProps {
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

export function RegistryComponentsContent({
  itemNames,
  currentPage,
  totalPages,
  totalItems,
  currentCategory,
  currentCategorySlug,
  categories,
  pageSize,
  description,
}: RegistryComponentsContentProps) {
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

  const searchResults = useMemo<readonly RegistryComponentMeta[] | null>(() => {
    if (!query) return null;
    const matched: RegistryComponentMeta[] = [];
    for (const c of registryComponents) {
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
    for (const c of registryComponents) if (matchesQuery(c, query)) total++;
    return total;
  }, [query]);

  const items = useMemo<readonly RegistryComponentMeta[]>(() => {
    const map = new Map(registryComponents.map((c) => [c.name, c]));
    return itemNames
      .map((name) => map.get(name))
      .filter((c): c is RegistryComponentMeta => Boolean(c));
  }, [itemNames]);

  const gridItems = searchResults ?? items;
  const handleCategoryChange = useCallback(
    (slug: string | null) => {
      const href = slug ? `/components/${slug}` : "/components";
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
                  href="/components"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Components
                </Link>
                <span className="mx-2 text-muted-foreground">/</span>
                {currentCategory}
              </>
            ) : (
              "Components"
            )}
          </span>
          <span className="text-2xl font-semibold text-primary md:text-3xl">({totalItems})</span>
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground md:text-xl">
          {description ??
            "Design system primitives: buttons, badges and other building blocks our sections are composed from. Install one and reuse it across your whole project."}
        </p>
      </header>

      <BrowseFilters
        query={rawQuery}
        onQueryChange={setRawQuery}
        searchPlaceholder="Search components…"
        searchLabel="Search components"
        options={filterOptions}
        value={currentCategorySlug ?? null}
        onValueChange={handleCategoryChange}
        allCount={registryComponents.length}
        disabled={isPending}
      >
          <p className="text-base text-muted-foreground">
            {query
              ? `${searchTotal} match${searchTotal === 1 ? "" : "es"}${
                  searchTotal > SEARCH_RESULT_CAP ? ` (showing first ${SEARCH_RESULT_CAP})` : ""
                }`
              : totalItems === 0
                ? "No components"
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
          {query ? `No components match "${rawQuery}".` : "No components in this category."}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {gridItems.map((c) => {
            const Component = c.component;
            return (
              /*
                The whole card is a link, and the link is a sibling of the card's
                contents rather than their ancestor: a live demo can contain its own
                anchors, and an anchor inside an anchor is not a thing a parser keeps
                — it splits the outer one, which would break the card and the
                hydration with it. An overlay covering the card gives the same result
                with none of that.
              */
              <div
                key={c.name}
                className="group relative flex flex-col gap-3 rounded-xl bg-muted p-3 transition-colors hover:bg-muted-foreground/15 has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-ring"
              >
                <Link
                  href={`/component/${c.name}`}
                  aria-label={c.title}
                  className="absolute inset-0 z-10 rounded-xl outline-none"
                />
                <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-md bg-background">
                  {/* Large-surface categories get fit-scaled so the whole demo
                      shows at its natural proportions, like block previews */}
                  {FRAME_PREVIEW_CATEGORIES.has(c.category) ? (
                    <FitScale>
                      <Component {...c.demoProps} />
                    </FitScale>
                  ) : (
                    <Component {...c.demoProps} />
                  )}
                  <div
                    className="pointer-events-none absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-md border bg-background opacity-0 transition-opacity group-hover:opacity-100"
                    aria-hidden="true"
                  >
                    <HugeiconsIcon icon={SourceCodeIcon} size={14} strokeWidth={2} />
                  </div>
                </div>
                <div className="relative flex flex-col gap-1 px-1 pb-1">
                  {/* Plain text: the card's own overlay link already carries this name,
                      and two anchors to one page is one more than a reader or a
                      crawler needs. The registry name is gone from here — it is what
                      you type into a terminal, not what you scan a grid for, and it
                      is on the page this card opens. */}
                  <h3 className="text-base font-semibold tracking-tight">{c.title}</h3>
                  <p className="line-clamp-2 text-base text-muted-foreground">
                    {c.description}
                  </p>
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

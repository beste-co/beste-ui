"use client";

import { SourceCodeIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState, useTransition } from "react";
import {
  BrowseFilters,
  BrowsePagerArrow,
  BrowsePagination,
} from "@/components/browse-filters";
import { NewBadge, useIsNew } from "@/components/new-badge";
import { ReplayButton } from "@/components/replay-button";
import { type BrowseSort, DEFAULT_SORT, SORT_OPTIONS } from "@/lib/browse-sort";
import { pieceInstallCommand } from "@/lib/install-command";
import { type ComponentMeta, components } from "@/lib/components";
import type { CategoryCount } from "./_lib/paginate";

/** The category picks the route; the sort is only ever a query. */
function browseHref(category: string | null, sort: BrowseSort = DEFAULT_SORT): string {
  const path = category ? `/pieces/${category}` : "/pieces";
  return sort === DEFAULT_SORT ? path : `${path}?sort=${sort}`;
}

interface ComponentsContentProps {
  itemNames: readonly string[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  currentCategory: string | undefined;
  currentCategorySlug: string | undefined;
  /** The order the server sorted `itemNames` into. */
  currentSort?: BrowseSort;
  /** Ship dates for recently added pieces, for the cards' NEW badge. */
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
  currentSort = DEFAULT_SORT,
  addedDates,
  categories,
  pageSize,
  description,
}: ComponentsContentProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isNewPiece = useIsNew(addedDates);
  // Remounts a one-shot piece demo so its entrance plays again
  const [replays, setReplays] = useState<Record<string, number>>({});

  const gridItems = useMemo<readonly ComponentMeta[]>(() => {
    const map = new Map(components.map((c) => [c.name, c]));
    return itemNames
      .map((name) => map.get(name))
      .filter((c): c is ComponentMeta => Boolean(c));
  }, [itemNames]);

  const handleCategoryChange = useCallback(
    (slug: string | null) => {
      startTransition(() => router.push(browseHref(slug, currentSort)));
    },
    [router, currentSort]
  );

  const handleSortChange = useCallback(
    (value: string | null) => {
      const sort = (value ?? DEFAULT_SORT) as BrowseSort;
      startTransition(() => router.push(browseHref(currentCategorySlug ?? null, sort)));
    },
    [router, currentCategorySlug]
  );

  /** The categories in the shape the filter bar takes them. */
  const filterOptions = useMemo(
    () => categories.map((c) => ({ label: c.category, value: c.slug, count: c.count })),
    [categories]
  );

  const showPagination = totalPages > 1;
  const rangeStart = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const rangeEnd = Math.min(currentPage * pageSize, totalItems);
  // Page 2 has to carry the sort with it, or the list silently reorders.
  const basePath = browseHref(currentCategorySlug ?? null, currentSort);

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

      {/* No search field: the site's own search (⌘K, and /ai/search behind it)
          already looks across blocks, pieces and components, and a second one
          scoped to this page competed with it while finding less. */}
      <BrowseFilters
        options={filterOptions}
        value={currentCategorySlug ?? null}
        onValueChange={handleCategoryChange}
        allCount={components.length}
        label="Category"
        extra={[
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
            {totalItems === 0 ? "No pieces" : `${rangeStart}–${rangeEnd} of ${totalItems}`}
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
        <div className="rounded-lg border border-dashed p-10 text-center text-base text-muted-foreground">
          No pieces in this category.
        </div>
      ) : (
        <>
        <PieceTable items={gridItems} />

        <div data-md-omit="" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                >
                  <Component key={replays[c.name] ?? 0} {...c.demoProps} />
                  {/* The corner marks as one cluster: the badge holds the
                      corner and the source-code hint fades in beside it, rather
                      than the two landing on the same spot. It sits above the
                      card's overlay link so the replay can be clicked. */}
                  <div className="pointer-events-none absolute right-2 top-2 z-20 flex items-center gap-1.5">
                    {c.isAnimated && (
                      <ReplayButton
                        onClick={() => setReplays((value) => ({ ...value, [c.name]: (value[c.name] ?? 0) + 1 }))}
                        className="pointer-events-auto opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100"
                      />
                    )}
                    <div
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md border bg-background opacity-0 transition-opacity group-hover:opacity-100"
                      aria-hidden="true"
                    >
                      <HugeiconsIcon icon={SourceCodeIcon} size={14} strokeWidth={2} />
                    </div>
                    {isNewPiece(c.name) && <NewBadge />}
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
        </>
      )}

      {showPagination && (
        <BrowsePagination currentPage={currentPage} totalPages={totalPages} basePath={basePath} />
      )}

    </div>
  );
}

/**
 * The listing as a table, for the Markdown rendition.
 *
 * Every card is a live demo behind a full-card overlay link, so the grid
 * converts to a run of bare links and loose lines. The same items fit in one
 * row each, and the row carries the install command the page never prints.
 * `hidden` keeps it out of the browser and out of the accessibility tree,
 * where the cards say all of it already; the Markdown route strips `hidden`
 * before converting, and the grid carries `data-md-omit` so only one of the
 * two ever appears.
 */
function PieceTable({ items }: { items: readonly ComponentMeta[] }) {
  return (
    <table hidden data-md-only="">
      <thead>
        <tr>
          <th scope="col">Piece</th>
          <th scope="col">Title</th>
          <th scope="col">Category</th>
          <th scope="col">Install</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.name}>
            <th scope="row">
              <a href={`/piece/${item.name}`}>{item.name}</a>
            </th>
            <td>{item.title}</td>
            <td>{item.category}</td>
            <td>
              <code>{pieceInstallCommand(item.name)}</code>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

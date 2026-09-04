"use client";

import { SourceCodeIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState, useTransition } from "react";
import { FitScale } from "@/components/fit-scale";
import {
  BrowseFilters,
  BrowsePagerArrow,
  BrowsePagination,
} from "@/components/browse-filters";
import { NewBadge, useIsNew } from "@/components/new-badge";
import { ReplayButton } from "@/components/replay-button";
import { type BrowseSort, DEFAULT_SORT, SORT_OPTIONS } from "@/lib/browse-sort";
import { componentInstallCommand } from "@/lib/install-command";
import { FRAME_PREVIEW_CATEGORIES } from "@/lib/registry-component-preview";
import { type RegistryComponentMeta, registryComponents } from "@/lib/registry-components";
import type { CategoryCount } from "./_lib/paginate";

/** The category picks the route; the sort is only ever a query. */
function browseHref(category: string | null, sort: BrowseSort = DEFAULT_SORT): string {
  const path = category ? `/components/${category}` : "/components";
  return sort === DEFAULT_SORT ? path : `${path}?sort=${sort}`;
}

interface RegistryComponentsContentProps {
  itemNames: readonly string[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  currentCategory: string | undefined;
  currentCategorySlug: string | undefined;
  /** The order the server sorted `itemNames` into. */
  currentSort?: BrowseSort;
  /** Ship dates for recently added components, for the cards' NEW badge. */
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

export function RegistryComponentsContent({
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
}: RegistryComponentsContentProps) {
  const router = useRouter();
  // Bumping a card's counter remounts its demo, replaying a one-shot animation
  const [replays, setReplays] = useState<Record<string, number>>({});
  const [isPending, startTransition] = useTransition();
  const isNewComponent = useIsNew(addedDates);

  const gridItems = useMemo<readonly RegistryComponentMeta[]>(() => {
    const map = new Map(registryComponents.map((c) => [c.name, c]));
    return itemNames
      .map((name) => map.get(name))
      .filter((c): c is RegistryComponentMeta => Boolean(c));
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

      {/* No search field: the site's own search (⌘K, and /ai/search behind it)
          already looks across blocks, pieces and components, and a second one
          scoped to this page competed with it while finding less. */}
      <BrowseFilters
        options={filterOptions}
        value={currentCategorySlug ?? null}
        onValueChange={handleCategoryChange}
        allCount={registryComponents.length}
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
            {totalItems === 0 ? "No components" : `${rangeStart}–${rangeEnd} of ${totalItems}`}
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
          No components in this category.
        </div>
      ) : (
        <>
        <ComponentTable items={gridItems} />

        <div data-md-omit="" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                    <FitScale key={replays[c.name] ?? 0}>
                      <Component {...c.demoProps} />
                    </FitScale>
                  ) : (
                    <Component key={replays[c.name] ?? 0} {...c.demoProps} />
                  )}
                  {/* The corner marks as one cluster: the badge holds the
                      corner and the source-code hint fades in beside it, rather
                      than the two landing on the same spot. The cluster sits
                      above the card's overlay link so the replay can be clicked. */}
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
                    {isNewComponent(c.name) && <NewBadge />}
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
function ComponentTable({ items }: { items: readonly RegistryComponentMeta[] }) {
  return (
    <table hidden data-md-only="">
      <thead>
        <tr>
          <th scope="col">Component</th>
          <th scope="col">Title</th>
          <th scope="col">Category</th>
          <th scope="col">Install</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.name}>
            <th scope="row">
              <a href={`/component/${item.name}`}>{item.name}</a>
            </th>
            <td>{item.title}</td>
            <td>{item.category}</td>
            <td>
              <code>{componentInstallCommand(item.name)}</code>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

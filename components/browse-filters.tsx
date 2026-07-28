"use client";

import {
  ArrowDown01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Cancel01Icon,
  MoreHorizontalIcon,
  Search01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import type { ReactNode } from "react";
import { IconButton } from "@/components/icon-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface BrowseFilterOption {
  /** What the reader picks, e.g. "Hero". */
  label: string;
  /** What it navigates to, e.g. "hero". */
  value: string;
  count?: number;
}

interface BrowseFiltersProps {
  /** Leave both out to drop the search field (a page that only filters). */
  query?: string;
  onQueryChange?: (value: string) => void;
  searchPlaceholder?: string;
  /** Spoken name for the field. Falls back to the placeholder. */
  searchLabel?: string;

  options: readonly BrowseFilterOption[];
  /** The option in force, by `value`. Null is "all". */
  value?: string | null;
  onValueChange: (value: string | null) => void;
  allLabel?: string;
  allCount?: number;

  /** Dims the picker while a navigation is in flight. */
  disabled?: boolean;
  /** The right-hand cluster: a count, a pager, whatever the page keeps there. */
  children?: ReactNode;
  className?: string;
}

/**
 * The filter bar every listing page wears: a search field and a category picker
 * on the left, whatever the page counts on the right.
 *
 * Both controls are pills on a filled surface rather than bordered boxes, which
 * is the language the rest of the site moved to — a control reads as something
 * to press because it is a shape, not because a line was drawn around it. They
 * are also the same height and the same radius, so the two read as one bar
 * instead of two widgets that happen to be adjacent.
 *
 * Site-only on purpose: this is page furniture, not a catalogue asset, so it
 * lives here rather than in the registry.
 */
export function BrowseFilters({
  query,
  onQueryChange,
  searchPlaceholder = "Search…",
  searchLabel,
  options,
  value = null,
  onValueChange,
  allLabel = "All categories",
  allCount,
  disabled = false,
  children,
  className,
}: BrowseFiltersProps) {
  const showSearch = typeof query === "string" && typeof onQueryChange === "function";
  const active = value ? options.find((option) => option.value === value) : undefined;

  return (
    <div
      className={cn("mb-8 flex items-center gap-1.5 sm:justify-between", className)}
    >
      {/* One row at every width. Stacked, the two controls ate a third of a phone
          screen before a single card showed; side by side the field takes what is
          left and the picker keeps only the width its label needs. */}
      <div className="flex flex-1 items-center gap-1.5">
        {showSearch && (
          <div className="relative min-w-0 flex-1 sm:max-w-xs">
            <HugeiconsIcon
              icon={Search01Icon}
              size={16}
              strokeWidth={2}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/50 sm:left-4"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => onQueryChange?.(event.target.value)}
              placeholder={searchPlaceholder}
              aria-label={searchLabel ?? searchPlaceholder}
              className={cn(
                "h-11 w-full rounded-full bg-muted/60 pl-10 pr-9 text-base text-foreground sm:pl-11 sm:pr-10",
                "outline-none transition-colors placeholder:text-foreground/50",
                "hover:bg-muted focus-visible:bg-muted focus-visible:ring-2 focus-visible:ring-ring/50",
                // Safari draws its own clear button on a search input, next to
                // ours; this is the only way to be rid of it.
                "[&::-webkit-search-cancel-button]:appearance-none"
              )}
            />
            {query ? (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => onQueryChange?.("")}
                className="absolute right-3 top-1/2 flex size-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-foreground/50 transition-colors hover:bg-foreground/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={14} strokeWidth={2} aria-hidden="true" />
              </button>
            ) : null}
          </div>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger
            disabled={disabled}
            className={cn(
              "flex h-11 shrink-0 cursor-pointer items-center justify-between gap-2 rounded-full bg-muted/60 px-4 text-base text-foreground",
              // Room for a label on a phone, the full width once there is one.
              "max-w-[45%] sm:max-w-none sm:min-w-[200px] sm:gap-3 sm:px-5",
              "outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/50",
              "disabled:pointer-events-none disabled:opacity-60"
            )}
          >
            <span className="flex min-w-0 items-center gap-2">
              <span className="truncate">{active?.label ?? allLabel}</span>
              {/* The count in monospace, in parentheses: the eyebrow the studio
                  set uses, and a number that then never shifts the label as it
                  changes width. Dropped on a phone, where the label itself is
                  already fighting for the room. */}
              <span className="hidden font-mono text-sm text-foreground/50 sm:inline">
                ({active ? (active.count ?? 0) : (allCount ?? options.length)})
              </span>
            </span>
            <HugeiconsIcon
              icon={ArrowDown01Icon}
              size={16}
              strokeWidth={2}
              className="shrink-0 text-foreground/50"
              aria-hidden="true"
            />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="start"
            className="max-h-[380px] w-[240px] overflow-y-auto rounded-xl"
          >
            <DropdownMenuItem
              onSelect={() => onValueChange(null)}
              className="flex cursor-pointer items-center justify-between gap-3 text-base"
            >
              <span className="flex min-w-0 items-center gap-2">
                <HugeiconsIcon
                  icon={Tick02Icon}
                  size={16}
                  strokeWidth={2}
                  className={cn("shrink-0", value && "invisible")}
                  aria-hidden="true"
                />
                <span className="truncate">{allLabel}</span>
              </span>
              <span className="font-mono text-sm text-foreground/50">
                {allCount ?? options.length}
              </span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {options.map((option) => {
              const selected = value === option.value;
              return (
                <DropdownMenuItem
                  key={option.value}
                  onSelect={() => onValueChange(option.value)}
                  className="flex cursor-pointer items-center justify-between gap-3 text-base"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    {/* Kept in the layout rather than added to it, so a row does
                        not move sideways when it becomes the selected one. */}
                    <HugeiconsIcon
                      icon={Tick02Icon}
                      size={16}
                      strokeWidth={2}
                      className={cn("shrink-0", !selected && "invisible")}
                      aria-hidden="true"
                    />
                    <span className="truncate">{option.label}</span>
                  </span>
                  <span className="font-mono text-sm text-foreground/50">{option.count}</span>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {children ? (
        <div className="hidden items-center gap-1.5 sm:flex">{children}</div>
      ) : null}
    </div>
  );
}

/** `?page=` appended without disturbing a query string that is already there. */
function pageHref(basePath: string, page: number): string {
  if (page <= 1) return basePath;
  const separator = basePath.includes("?") ? "&" : "?";
  return `${basePath}${separator}page=${page}`;
}

/**
 * First, last, and a window around the current page; gaps become an ellipsis.
 * Seven or fewer pages are all shown, since the elision would save nothing.
 */
function pageWindow(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "ellipsis")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) pages.push("ellipsis");
  for (let page = start; page <= end; page++) pages.push(page);
  if (end < total - 1) pages.push("ellipsis");
  pages.push(total);
  return pages;
}

interface BrowsePaginationProps {
  currentPage: number;
  totalPages: number;
  /** The path the numbers hang `?page=` off, usually the current pathname. */
  basePath: string;
  className?: string;
}

/**
 * The pager under a listing, in the same language as the bar above it: round
 * arrows and round numbers on the filled surface, the current page inverted
 * rather than outlined.
 *
 * The numbers are `sm` and up. Seven 44px targets plus two arrows do not fit
 * across a phone, and the honest answer there is which page you are on and a way
 * to the next one, not a row of numbers scaled down until none of them can be
 * pressed.
 */
export function BrowsePagination({
  currentPage,
  totalPages,
  basePath,
  className,
}: BrowsePaginationProps) {
  if (totalPages <= 1) return null;
  const pages = pageWindow(currentPage, totalPages);

  return (
    <nav aria-label="pagination" className={cn("mt-12 flex justify-center", className)}>
      <ul className="flex items-center gap-1">
        <li>
          <BrowsePagerArrow
            direction="prev"
            label="Go to previous page"
            href={currentPage > 1 ? pageHref(basePath, currentPage - 1) : undefined}
          />
        </li>

        <li className="px-2 text-base text-foreground/70 sm:hidden">
          Page {currentPage} of {totalPages}
        </li>

        {pages.map((page, index) =>
          page === "ellipsis" ? (
            <li
              // Two ellipses can appear in one window, and neither has a value
              // of its own to key on.
              key={`ellipsis-${index}`}
              aria-hidden="true"
              className="hidden size-11 items-center justify-center text-foreground/50 sm:flex"
            >
              <HugeiconsIcon icon={MoreHorizontalIcon} size={16} strokeWidth={2} />
            </li>
          ) : (
            <li key={page} className="hidden sm:block">
              <Link
                href={pageHref(basePath, page)}
                aria-current={page === currentPage ? "page" : undefined}
                className={cn(
                  "flex size-11 items-center justify-center rounded-full text-base tabular-nums transition-colors",
                  "outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                  // Filled either way, like the arrows: an unfilled number beside
                  // two pills read as a label rather than something to press.
                  page === currentPage
                    ? "bg-foreground font-medium text-background"
                    : "bg-muted/60 text-foreground/70 hover:bg-muted hover:text-foreground"
                )}
              >
                {page}
              </Link>
            </li>
          )
        )}

        <li>
          <BrowsePagerArrow
            direction="next"
            label="Go to next page"
            href={currentPage < totalPages ? pageHref(basePath, currentPage + 1) : undefined}
          />
        </li>
      </ul>
    </nav>
  );
}

interface BrowsePagerArrowProps {
  /** Where it goes. Left out, the arrow is the end of the run and is dimmed. */
  href?: string;
  direction: "prev" | "next";
  label: string;
}

/**
 * One step through a listing, as the library's icon-only button.
 *
 * `IconButton` is the one built for this — the site's hugeicons copy of the
 * registry's `button4`: the label is a required prop and becomes the accessible
 * name rather than visible text, so a bare arrow still announces itself. Its
 * tone is overridden to the same filled pill the field and the picker wear,
 * since a bordered circle beside two borderless controls reads as a different
 * kind of thing.
 */
export function BrowsePagerArrow({ href, direction, label }: BrowsePagerArrowProps) {
  const icon = direction === "prev" ? ArrowLeft01Icon : ArrowRight01Icon;
  // size-11 rather than the button's own `md`, to stand exactly as tall as the
  // search field and the picker beside it.
  const shape = "size-11 border-0 bg-muted/60 hover:bg-muted";

  if (!href) {
    return (
      <span aria-hidden="true" className="pointer-events-none opacity-40">
        <IconButton label={label} icon={icon} className={shape} />
      </span>
    );
  }

  return (
    <IconButton asChild label={label} icon={icon} className={shape}>
      <Link href={href} />
    </IconButton>
  );
}

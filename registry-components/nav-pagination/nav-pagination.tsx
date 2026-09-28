"use client";

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import * as React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

/** Surface of the page strip. Mirrors the inspector family. */
type Tone = "muted" | "outline" | "ghost";

/** Item size preset. Mirrors the inspector family. */
type Size = "sm" | "default" | "lg";

type Align = "start" | "center" | "end";

export type PaginationItem = number | "start-ellipsis" | "end-ellipsis";

// Concentric corners: the bar's radius is the item's 6px plus the 4px padding plus the 1px border
const toneStyles: Record<Tone, string> = {
  muted: "border border-transparent bg-muted p-1",
  outline: "border border-border bg-background p-1",
  ghost: "border border-transparent",
};

const sizeStyles: Record<Size, string> = {
  sm: "text-sm [--pagination-item:--spacing(7)] [--pagination-icon:--spacing(4)]",
  default: "text-sm [--pagination-item:--spacing(8)] [--pagination-icon:--spacing(4)]",
  lg: "text-base [--pagination-item:--spacing(10)] [--pagination-icon:--spacing(5)]",
};

/** Where the page strip sits when the range and page size move to their own row. */
const alignStyles: Record<Align, string> = {
  start: "justify-self-start",
  center: "justify-self-center",
  end: "justify-self-end",
};

/** The inspector family's spring, so the marker slides without an animation library. */
const SPRING_EASE =
  "linear(0, 0.014, 0.056 3.4%, 0.216 7.2%, 0.472 11.6%, 0.72 16%, 0.895 20%, 0.986 23.6%, 1.036 27.8%, 1.045 32.4%, 1.026 39.4%, 0.998 46.6%, 0.992 52.4%, 1.001 66.4%, 1)";

const useIsoLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

const range = (from: number, to: number) => (to < from ? [] : Array.from({ length: to - from + 1 }, (_, i) => from + i));

/**
 * The page list with ellipses, always the same length for a given page count, so the
 * strip never changes width as the reader walks through it.
 */
export function paginationRange(page: number, count: number, siblings = 1, boundaries = 1): PaginationItem[] {
  if (count <= 0) return [];
  const startPages = range(1, Math.min(boundaries, count));
  const endPages = range(Math.max(count - boundaries + 1, boundaries + 1), count);
  const siblingsStart = Math.max(Math.min(page - siblings, count - boundaries - siblings * 2 - 1), boundaries + 2);
  const siblingsEnd = Math.min(Math.max(page + siblings, boundaries + siblings * 2 + 2), (endPages[0] ?? count + 1) - 2);
  const items: (PaginationItem | null)[] = [
    ...startPages,
    siblingsStart > boundaries + 2 ? "start-ellipsis" : boundaries + 1 < count - boundaries ? boundaries + 1 : null,
    ...range(siblingsStart, siblingsEnd),
    siblingsEnd < count - boundaries - 1 ? "end-ellipsis" : count - boundaries > boundaries ? count - boundaries : null,
    ...endPages,
  ];
  const seen = new Set<PaginationItem>();
  return items.filter((item): item is PaginationItem => {
    if (item === null || seen.has(item)) return false;
    seen.add(item);
    return true;
  });
}

export interface PaginationLinkProps extends React.ComponentPropsWithoutRef<"a"> {
  href: string;
}

export interface NavPaginationProps {
  /** Total number of items. Gives the page count with `pageSize`, and the range readout. */
  total?: number;
  /** Page count, when you have it directly. Wins over `total`. */
  pageCount?: number;
  /** Current page, one-based. Pair with `onPageChange` to control it. */
  page?: number;
  /** @defaultValue 1 */
  defaultPage?: number;
  onPageChange?: (page: number) => void;
  /** Items per page. Pair with `onPageSizeChange` to control it. */
  pageSize?: number;
  /** @defaultValue 10 */
  defaultPageSize?: number;
  onPageSizeChange?: (pageSize: number) => void;
  /** Offer a page size menu with these choices. Two or more show it. */
  pageSizeOptions?: number[];
  /**
   * Pages shown on each side of the current one.
   * @defaultValue 1 */
  siblings?: number;
  /**
   * Pages always shown at each end.
   * @defaultValue 1 */
  boundaries?: number;
  /** Render pages as links to these addresses instead of buttons. */
  getHref?: (page: number, pageSize: number) => string;
  /** Render the links through your router, e.g. `(props) => <Link {...props} />`. */
  renderLink?: (props: PaginationLinkProps) => React.ReactNode;
  /** Write "Previous" and "Next" beside the arrows. */
  showLabels?: boolean;
  /** Show "21 to 40 of 312". Needs `total`. */
  showRange?: boolean;
  /** @defaultValue "center" */
  align?: Align;
  /** Words used by the component, for translation. */
  labels?: Partial<typeof DEFAULT_LABELS>;
  /** @defaultValue "ghost" */
  tone?: Tone;
  /** @defaultValue "default" */
  size?: Size;
  disabled?: boolean;
  /** @defaultValue "Pagination" */
  "aria-label"?: string;
  className?: string;
}

const DEFAULT_LABELS = {
  previous: "Previous",
  next: "Next",
  previousPage: "Previous page",
  nextPage: "Next page",
  page: "Page",
  of: "of",
  to: "to",
  goTo: "Go to page",
  perPage: "per page",
  rowsPerPage: "Per page",
};

export const navPaginationDemo: NavPaginationProps = {
  total: 312,
  defaultPage: 6,
  defaultPageSize: 20,
  pageSizeOptions: [10, 20, 50],
  showRange: true,
  showLabels: true,
  className: "w-full max-w-3xl",
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/**
 * Page numbers with ellipses that stay the same width as the reader walks through, a
 * marker that slides to the current page, and ellipses that open into a "go to page" field.
 */
export function NavPagination({
  total,
  pageCount,
  page,
  defaultPage = 1,
  onPageChange,
  pageSize,
  defaultPageSize = 10,
  onPageSizeChange,
  pageSizeOptions,
  siblings = 1,
  boundaries = 1,
  getHref,
  renderLink = (props) => <a {...props} />,
  showLabels = false,
  showRange = false,
  align = "center",
  labels: labelOverrides,
  tone = "ghost",
  size = "default",
  disabled = false,
  "aria-label": ariaLabel = "Pagination",
  className,
}: NavPaginationProps) {
  const labels = { ...DEFAULT_LABELS, ...labelOverrides };
  const [innerSize, setInnerSize] = React.useState(defaultPageSize);
  const perPage = Math.max(1, pageSize ?? innerSize);
  const count = Math.max(1, pageCount ?? (total !== undefined ? Math.ceil(total / perPage) : 1));
  const [innerPage, setInnerPage] = React.useState(defaultPage);
  const current = clamp(page ?? innerPage, 1, count);
  const items = paginationRange(current, count, Math.max(0, siblings), Math.max(1, boundaries));
  const [jumping, setJumping] = React.useState<PaginationItem | null>(null);
  // After a jump the field unmounts; focus lands on the page it went to
  const focusCurrent = React.useRef(false);

  const go = (next: number) => {
    const target = clamp(next, 1, count);
    if (target === current || disabled) return;
    if (page === undefined) setInnerPage(target);
    onPageChange?.(target);
  };

  const changeSize = (next: number) => {
    if (next === perPage) return;
    // Keep the first item on screen in view: row 41 at 20 per page is page 3, at 50 it is page 1
    const firstItem = (current - 1) * perPage;
    const nextPage = Math.floor(firstItem / next) + 1;
    if (pageSize === undefined) setInnerSize(next);
    onPageSizeChange?.(next);
    if (nextPage !== current) {
      if (page === undefined) setInnerPage(nextPage);
      onPageChange?.(nextPage);
    }
  };

  // The marker's place is measured from the current page's box and written to CSS variables
  const listRef = React.useRef<HTMLUListElement>(null);
  const placeMarker = React.useCallback(() => {
    const list = listRef.current;
    const active = list?.querySelector<HTMLElement>("[aria-current='page']");
    if (!list) return;
    if (!active) {
      list.dataset.marker = "off";
      return;
    }
    const first = list.dataset.marker !== "on";
    if (first) list.dataset.instant = "true";
    list.style.setProperty("--pagination-x", `${active.offsetLeft}px`);
    list.style.setProperty("--pagination-w", `${active.offsetWidth}px`);
    list.dataset.marker = "on";
    if (first) {
      void list.offsetWidth;
      delete list.dataset.instant;
    }
  }, []);

  useIsoLayoutEffect(() => {
    placeMarker();
    if (focusCurrent.current) {
      focusCurrent.current = false;
      listRef.current?.querySelector<HTMLElement>("[aria-current='page']")?.focus();
    }
  }, [current, count, jumping, size, placeMarker]);

  React.useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const ro = new ResizeObserver(() => {
      list.dataset.instant = "true";
      placeMarker();
      void list.offsetWidth;
      delete list.dataset.instant;
    });
    ro.observe(list);
    return () => ro.disconnect();
  }, [placeMarker]);

  const itemClass =
    "relative z-10 inline-flex h-(--pagination-item) min-w-(--pagination-item) shrink-0 cursor-pointer items-center justify-center gap-1 rounded-md px-2 tabular-nums outline-none transition-colors duration-200 select-none focus-visible:ring-2 focus-visible:ring-ring aria-disabled:pointer-events-none aria-disabled:opacity-40 disabled:pointer-events-none disabled:opacity-40";

  const pageTarget = (target: number, children: React.ReactNode, props: { className: string; "aria-label"?: string; "aria-current"?: "page"; off?: boolean }) => {
    const { off, ...rest } = props;
    if (getHref) {
      if (off) return <a aria-disabled="true" role="link" {...rest}>{children}</a>;
      return renderLink({
        href: getHref(target, perPage),
        onClick: () => go(target),
        ...rest,
        children,
      });
    }
    return (
      <button type="button" disabled={off || disabled} onClick={() => go(target)} {...rest}>
        {children}
      </button>
    );
  };

  const hasRange = showRange && total !== undefined;
  const hasSizes = Boolean(pageSizeOptions && pageSizeOptions.length > 1);
  const first = (current - 1) * perPage + 1;
  const last = total !== undefined ? Math.min(total, current * perPage) : current * perPage;

  return (
    <nav aria-label={ariaLabel} data-slot="nav-pagination" className={cn("@container w-full", sizeStyles[size], className)}>
      {/* Narrow: the page strip, then range and page size on a row of their own. Wide: all three on one line */}
      <div className={cn("grid items-center gap-x-6 gap-y-3 @3xl:grid-cols-[1fr_auto_1fr]", disabled && "opacity-50")}>
        <div className={cn("flex items-center gap-1 @3xl:col-start-2 @3xl:row-start-1 @3xl:justify-self-center", alignStyles[align])}>
          {pageTarget(current - 1, (
            <>
              <ChevronLeft aria-hidden="true" className="size-(--pagination-icon)" />
              {showLabels && <span className="hidden pr-1 @md:inline">{labels.previous}</span>}
            </>
          ), {
            className: cn(itemClass, "text-foreground hover:bg-foreground/5"),
            "aria-label": labels.previousPage,
            off: current <= 1,
          })}

          <ul
            ref={listRef}
            data-marker="off"
            className={cn(
              "group/list relative hidden items-center gap-0.5 rounded-[11px] @md:flex",
              toneStyles[tone],
            )}
          >
            <li
              role="presentation"
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute top-1/2 left-0 h-(--pagination-item) w-(--pagination-w) -translate-y-1/2 translate-x-(--pagination-x) rounded-md bg-foreground opacity-0",
                "group-data-[marker=on]/list:opacity-100 motion-safe:transition-[translate,width] motion-safe:duration-500 group-data-[instant=true]/list:transition-none",
              )}
              style={{ transitionTimingFunction: SPRING_EASE }}
            />
            {items.map((item) => {
              if (typeof item === "number") {
                const active = item === current;
                return (
                  <li key={item}>
                    {pageTarget(item, item, {
                      className: cn(itemClass, active ? "text-background" : "text-foreground hover:bg-foreground/5"),
                      "aria-label": `${labels.page} ${item}`,
                      "aria-current": active ? "page" : undefined,
                    })}
                  </li>
                );
              }
              if (jumping === item) {
                return (
                  <li key={item}>
                    <JumpField
                      count={count}
                      label={labels.goTo}
                      onGo={(target) => {
                        focusCurrent.current = true;
                        setJumping(null);
                        go(target);
                      }}
                      onCancel={() => setJumping(null)}
                    />
                  </li>
                );
              }
              return (
                <li key={item}>
                  <button
                    type="button"
                    disabled={disabled}
                    aria-label={labels.goTo}
                    onClick={() => setJumping(item)}
                    className={cn(itemClass, "text-muted-foreground hover:bg-foreground/5 hover:text-foreground")}
                  >
                    <MoreHorizontal aria-hidden="true" className="size-(--pagination-icon)" />
                  </button>
                </li>
              );
            })}
          </ul>

          <p className="select-none px-2 text-foreground tabular-nums @md:hidden">
            {labels.page} {current} {labels.of} {count}
          </p>

          {pageTarget(current + 1, (
            <>
              {showLabels && <span className="hidden pl-1 @md:inline">{labels.next}</span>}
              <ChevronRight aria-hidden="true" className="size-(--pagination-icon)" />
            </>
          ), {
            className: cn(itemClass, "text-foreground hover:bg-foreground/5"),
            "aria-label": labels.nextPage,
            off: current >= count,
          })}
        </div>

        {(hasRange || hasSizes) && (
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 @3xl:contents">
            {hasRange && (
              <p className="select-none text-muted-foreground tabular-nums @3xl:col-start-1 @3xl:row-start-1 @3xl:justify-self-start" aria-live="polite">
                {total === 0 ? `0 ${labels.of} 0` : `${first} ${labels.to} ${last} ${labels.of} ${total}`}
              </p>
            )}
            {hasSizes && (
              <div className="ml-auto flex items-center gap-2 @3xl:col-start-3 @3xl:row-start-1 @3xl:ml-0 @3xl:justify-self-end">
                <span className="select-none text-muted-foreground">{labels.rowsPerPage}</span>
                <Select value={String(perPage)} onValueChange={(next) => changeSize(Number(next))} disabled={disabled}>
                  <SelectTrigger
                    aria-label={labels.perPage}
                    className="h-(--pagination-item) cursor-pointer gap-1 px-2.5 tabular-nums data-[size=default]:h-(--pagination-item) data-[size=sm]:h-(--pagination-item)"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(pageSizeOptions ?? []).map((option) => (
                      <SelectItem key={option} value={String(option)} className="cursor-pointer tabular-nums">
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

/** The ellipsis opened into a field: Enter goes, Escape or leaving closes it. */
function JumpField({ count, label, onGo, onCancel }: { count: number; label: string; onGo: (page: number) => void; onCancel: () => void }) {
  const [text, setText] = React.useState("");
  const [invalid, setInvalid] = React.useState(false);
  const submit = () => {
    const value = Number.parseInt(text, 10);
    if (!Number.isFinite(value) || value < 1 || value > count) {
      setInvalid(true);
      return;
    }
    onGo(value);
  };
  return (
    <Input
      autoFocus
      inputMode="numeric"
      aria-label={`${label}, 1 to ${count}`}
      aria-invalid={invalid || undefined}
      placeholder={`1 to ${count}`}
      value={text}
      onChange={(event) => {
        setText(event.target.value.replace(/[^0-9]/g, ""));
        setInvalid(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          submit();
        } else if (event.key === "Escape") {
          event.preventDefault();
          onCancel();
        }
      }}
      onBlur={onCancel}
      className="relative z-10 h-(--pagination-item) w-20 px-2 text-center tabular-nums md:text-sm"
    />
  );
}

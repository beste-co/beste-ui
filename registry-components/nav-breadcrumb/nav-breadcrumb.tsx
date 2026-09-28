"use client";

import { ChevronRight, Home, MoreHorizontal } from "lucide-react";
import * as React from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

/** Surface of the trail. Mirrors the inspector family. */
type Tone = "muted" | "outline" | "ghost";

/** Item size preset. Mirrors the inspector family. */
type Size = "sm" | "default" | "lg";

export interface BreadcrumbItem {
  label: string;
  /** Address of this level. `getHref` wins when both are given. */
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface BreadcrumbLinkProps extends React.ComponentPropsWithoutRef<"a"> {
  href: string;
}

export interface NavBreadcrumbProps {
  /** The path from the top level down to the current page, which is the last item. */
  items: BreadcrumbItem[];
  /** Address for each level. Without it, and without `href` on an item, levels render as buttons that call `onNavigate`. */
  getHref?: (item: BreadcrumbItem, index: number) => string;
  /** Render the links through your router, e.g. `(props) => <Link {...props} />`. */
  renderLink?: (props: BreadcrumbLinkProps) => React.ReactNode;
  /** Called when a level is chosen, from the trail or from the menu of hidden levels. */
  onNavigate?: (item: BreadcrumbItem, index: number) => void;
  /** @defaultValue "chevron" */
  separator?: "chevron" | "slash";
  /** A house icon on the first level when it has none of its own. */
  homeIcon?: boolean;
  /**
   * Widest a single level may grow before its label is cut with an ellipsis, in pixels.
   * @defaultValue 180 */
  maxItemWidth?: number;
  /** @defaultValue "ghost" */
  tone?: Tone;
  /** @defaultValue "default" */
  size?: Size;
  /** Words used by the component, for translation. */
  labels?: Partial<typeof DEFAULT_LABELS>;
  /** @defaultValue "Breadcrumb" */
  "aria-label"?: string;
  className?: string;
}

const DEFAULT_LABELS = {
  /** `{count}` is replaced with the number of hidden levels. */
  more: "Show {count} more levels",
};

export const navBreadcrumbDemo: NavBreadcrumbProps = {
  items: [
    { label: "Home", href: "https://beste.co" },
    { label: "Labels", href: "https://beste.co" },
    { label: "Blue Note Records", href: "https://beste.co" },
    { label: "Artists", href: "https://beste.co" },
    { label: "Robert Glasper", href: "https://beste.co" },
    { label: "Albums", href: "https://beste.co" },
    { label: "Black Radio III, deluxe edition" },
  ],
  homeIcon: true,
  className: "w-full max-w-md",
};

// Even padding on every side and a radius of the item's 6px plus that 4px, so a hovered item sits concentric in the bar
const toneStyles: Record<Tone, string> = {
  muted: "rounded-[10px] bg-muted p-1",
  outline: "rounded-[10px] border border-border bg-background p-1",
  ghost: "",
};

const sizeStyles: Record<Size, string> = {
  sm: "text-sm [--crumb-item:--spacing(7)] [--crumb-icon:--spacing(3.5)]",
  default: "text-sm [--crumb-item:--spacing(8)] [--crumb-icon:--spacing(4)]",
  lg: "text-base [--crumb-item:--spacing(10)] [--crumb-icon:--spacing(4.5)]",
};

const useIsoLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

const itemClass =
  "inline-flex h-(--crumb-item) min-w-0 items-center gap-1.5 rounded-md px-1.5 outline-none select-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset";

// A component (not a call) so menu items can slot onto it and forward their props
function RenderedLink({ via, ...props }: BreadcrumbLinkProps & { via: (props: BreadcrumbLinkProps) => React.ReactNode }) {
  return via(props);
}

/**
 * A breadcrumb trail that folds its middle into a "…" menu when it runs out of room.
 * The fold is measured from the real widths of the levels, not guessed from a count.
 */
export function NavBreadcrumb({
  items,
  getHref,
  renderLink = (props) => <a {...props} />,
  onNavigate,
  separator = "chevron",
  homeIcon = false,
  maxItemWidth = 180,
  tone = "ghost",
  size = "default",
  labels: labelOverrides,
  "aria-label": ariaLabel = "Breadcrumb",
  className,
}: NavBreadcrumbProps) {
  const labels = { ...DEFAULT_LABELS, ...labelOverrides };
  const count = items.length;
  // How many levels after the first are folded into the menu; the last level is never folded
  const [hidden, setHidden] = React.useState(0);
  const listRef = React.useRef<HTMLOListElement>(null);
  const measureRef = React.useRef<HTMLDivElement>(null);

  const measure = React.useCallback(() => {
    const list = listRef.current;
    const ruler = measureRef.current;
    if (!list || !ruler) return;
    const styles = getComputedStyle(list);
    const available = list.clientWidth - Number.parseFloat(styles.paddingLeft) - Number.parseFloat(styles.paddingRight);
    const widths = Array.from({ length: count }, (_, i) => ruler.querySelector<HTMLElement>(`[data-measure-item="${i}"]`)?.offsetWidth ?? 0);
    const sep = ruler.querySelector<HTMLElement>("[data-measure-sep]")?.offsetWidth ?? 0;
    const more = ruler.querySelector<HTMLElement>("[data-measure-more]")?.offsetWidth ?? 0;
    const width = (fold: number) => {
      let sum = 0;
      let shown = 0;
      widths.forEach((w, i) => {
        if (i > 0 && i <= fold) return;
        sum += w;
        shown++;
      });
      return sum + (shown - 1) * sep + (fold > 0 ? more + sep : 0);
    };
    let fold = 0;
    // Fold from the top of the middle first, so the nearest parents stay in view
    while (fold < count - 2 && width(fold) > available) fold++;
    setHidden((prev) => (prev === fold ? prev : fold));
  }, [count]);

  useIsoLayoutEffect(() => {
    measure();
  }, [measure, items, separator, homeIcon, maxItemWidth, size]);

  React.useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(list);
    return () => ro.disconnect();
  }, [measure]);

  const iconFor = (item: BreadcrumbItem, index: number) => item.icon ?? (homeIcon && index === 0 ? Home : undefined);

  const face = (item: BreadcrumbItem, index: number) => {
    const Icon = iconFor(item, index);
    return (
      <>
        {Icon && <Icon aria-hidden="true" className="size-(--crumb-icon) shrink-0" />}
        <span className="truncate">{item.label}</span>
      </>
    );
  };

  const hrefOf = (item: BreadcrumbItem, index: number) => (getHref ? getHref(item, index) : item.href);

  const renderLevel = (item: BreadcrumbItem, index: number) => {
    const last = index === count - 1;
    const style = { maxWidth: maxItemWidth };
    const title = item.label;
    if (last) {
      return (
        <span aria-current="page" title={title} className={cn(itemClass, "font-medium text-foreground")} style={style}>
          {face(item, index)}
        </span>
      );
    }
    const className = cn(itemClass, "cursor-pointer text-muted-foreground transition-colors duration-200 hover:bg-foreground/5 hover:text-foreground");
    const href = hrefOf(item, index);
    if (href) {
      return renderLink({ href, title, className, style, onClick: () => onNavigate?.(item, index), children: face(item, index) });
    }
    return (
      <button type="button" title={title} className={className} style={style} onClick={() => onNavigate?.(item, index)}>
        {face(item, index)}
      </button>
    );
  };

  const separatorNode = (
    <span className="flex shrink-0 items-center px-0.5 text-muted-foreground/60">
      {separator === "chevron" ? <ChevronRight className="size-(--crumb-icon)" /> : <span className="px-1">/</span>}
    </span>
  );

  const folded = items.slice(1, 1 + hidden);
  const visible = items.map((item, index) => ({ item, index })).filter(({ index }) => index === 0 || index > hidden);
  const moreLabel = labels.more.replace("{count}", String(folded.length));

  return (
    <nav aria-label={ariaLabel} data-slot="nav-breadcrumb" className={cn("relative min-w-0", sizeStyles[size], className)}>
      <ol ref={listRef} className={cn("flex min-w-0 items-center overflow-hidden", toneStyles[tone])}>
        {visible.map(({ item, index }, position) => (
          <React.Fragment key={`${index}-${item.label}`}>
            {position > 0 && (
              <li role="presentation" aria-hidden="true" className="flex shrink-0">
                {separatorNode}
              </li>
            )}
            {/* The folded levels sit right after the first one, where they came from */}
            {position === 1 && hidden > 0 && (
              <>
                <li className="flex shrink-0">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      aria-label={moreLabel}
                      title={moreLabel}
                      className={cn(
                        itemClass,
                        "cursor-pointer text-muted-foreground transition-[color,background-color,scale] duration-200 hover:bg-foreground/5 hover:text-foreground data-[state=open]:bg-foreground/5 data-[state=open]:text-foreground",
                        "motion-safe:starting:scale-75 starting:opacity-0",
                      )}
                    >
                      <MoreHorizontal aria-hidden="true" className="size-(--crumb-icon)" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="min-w-48 max-w-72">
                      {folded.map((level, offset) => {
                        const levelIndex = offset + 1;
                        const href = hrefOf(level, levelIndex);
                        const Icon = iconFor(level, levelIndex);
                        const content = (
                          <>
                            {Icon && <Icon aria-hidden="true" />}
                            <span className="truncate">{level.label}</span>
                          </>
                        );
                        return (
                          <DropdownMenuItem
                            key={`${levelIndex}-${level.label}`}
                            asChild={Boolean(href)}
                            title={level.label}
                            className="cursor-pointer"
                            style={{ paddingLeft: `calc(var(--spacing) * 2 + ${offset * 10}px)` }}
                            onSelect={() => onNavigate?.(level, levelIndex)}
                          >
                            {href ? <RenderedLink via={renderLink} href={href}>{content}</RenderedLink> : content}
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </li>
                <li role="presentation" aria-hidden="true" className="flex shrink-0">
                  {separatorNode}
                </li>
              </>
            )}
            {/* The first and last levels shrink before anything else overflows; the rest keep their size */}
            <li className={cn("flex min-w-0", index === count - 1 || index === 0 ? "shrink" : "shrink-0")}>{renderLevel(item, index)}</li>
          </React.Fragment>
        ))}
      </ol>

      {/* A hidden copy of every piece at its natural size: the fold is decided from these widths */}
      <div ref={measureRef} aria-hidden="true" className="pointer-events-none invisible absolute top-0 left-0 flex w-max whitespace-nowrap *:shrink-0">
        {items.map((item, index) => (
          <span key={`${index}-${item.label}`} data-measure-item={index} className={cn(itemClass, index === count - 1 && "font-medium")} style={{ maxWidth: maxItemWidth }}>
            {face(item, index)}
          </span>
        ))}
        <span data-measure-sep="" className="flex">
          {separatorNode}
        </span>
        <span data-measure-more="" className={itemClass}>
          <MoreHorizontal className="size-(--crumb-icon)" />
        </span>
      </div>
    </nav>
  );
}

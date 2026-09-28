"use client";

import { CalendarDays, ChevronLeft, ChevronRight, Disc3, LayoutGrid, ListMusic, Newspaper, Settings, ShoppingBag, Video } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

/** Surface of the strip for the pill and segment variants. Mirrors the inspector family. */
type Tone = "muted" | "outline" | "ghost";

/** Tab height preset. Mirrors the inspector family. */
type Size = "sm" | "default" | "lg";

/** How the current tab is marked: a line under it, a filled pill, or a raised segment. */
type Variant = "underline" | "pill" | "segment";

export interface NavTab {
  /** Stable key, reported through `onValueChange`. */
  value: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  /** A small count after the label, e.g. unread items. */
  count?: number;
  disabled?: boolean;
  /** The panel shown while this tab is current. Leave every `content` out for a bare strip. */
  content?: React.ReactNode;
}

export interface NavTabLinkProps extends React.ComponentPropsWithoutRef<"a"> {
  href: string;
}

export interface NavTabsProps {
  tabs: NavTab[];
  /** Current tab. Pair with `onValueChange` to control it. */
  value?: string;
  /** @defaultValue the first enabled tab */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** @defaultValue "underline" */
  variant?: Variant;
  /**
   * `automatic` selects a tab as the arrow keys reach it; `manual` only moves focus, and Enter or Space selects.
   * @defaultValue "automatic" */
  activation?: "automatic" | "manual";
  /** Keep inactive panels mounted (hidden) instead of unmounting them. */
  keepMounted?: boolean;
  /** Render tabs as links to these addresses instead of buttons; panels are then left to your routes. */
  getHref?: (value: string) => string;
  /** Render the links through your router, e.g. `(props) => <Link {...props} />`. */
  renderLink?: (props: NavTabLinkProps) => React.ReactNode;
  /** @defaultValue "muted" */
  tone?: Tone;
  /** @defaultValue "default" */
  size?: Size;
  disabled?: boolean;
  /** Extra classes for the panel. */
  panelClassName?: string;
  /** @defaultValue "Tabs" */
  "aria-label"?: string;
  className?: string;
}

export const navTabsDemo: NavTabsProps = {
  "aria-label": "Artist sections",
  defaultValue: "releases",
  tabs: [
    { value: "overview", label: "Overview", icon: LayoutGrid, content: "Robert Glasper Experiment, on the road through the winter with a new trio set." },
    { value: "releases", label: "Releases", icon: Disc3, count: 24, content: "Twenty four records, from the first Blue Note session to last spring's live album." },
    { value: "tour", label: "Tour dates", icon: CalendarDays, count: 12, content: "Twelve nights across Europe, opening at the Barbican with Esperanza Spalding." },
    { value: "setlists", label: "Setlists", icon: ListMusic, content: "Every set from the last tour, with the songs that changed night to night." },
    { value: "videos", label: "Videos", icon: Video, content: "Live sessions and the documentary cut from the Montreux show." },
    { value: "press", label: "Press", icon: Newspaper, content: "Reviews, interviews and the press kit, with photos cleared for print." },
    { value: "merch", label: "Merch", icon: ShoppingBag, disabled: true, content: "The shop opens with the next release." },
    { value: "settings", label: "Settings", icon: Settings, content: "Who can edit this page and where the tour dates are pulled from." },
  ],
  className: "w-full max-w-lg",
};

/** The inspector family's spring, so the indicator slides without an animation library. */
const SPRING_EASE =
  "linear(0, 0.014, 0.056 3.4%, 0.216 7.2%, 0.472 11.6%, 0.72 16%, 0.895 20%, 0.986 23.6%, 1.036 27.8%, 1.045 32.4%, 1.026 39.4%, 0.998 46.6%, 0.992 52.4%, 1.001 66.4%, 1)";

/** Width of the fade at a scrollable edge; the current tab is kept clear of it. */
const FADE = 32;

// Concentric corners: the tab's 6px plus the list's 4px padding (plus the 1px border on outline)
const toneStyles: Record<Tone, string> = {
  muted: "rounded-[10px] bg-muted",
  outline: "rounded-[11px] border border-border bg-background",
  ghost: "",
};

const sizeStyles: Record<Size, string> = {
  sm: "text-sm [--tabs-item:--spacing(7)] [--tabs-icon:--spacing(4)]",
  default: "text-sm [--tabs-item:--spacing(9)] [--tabs-icon:--spacing(4)]",
  lg: "text-base [--tabs-item:--spacing(10)] [--tabs-icon:--spacing(5)]",
};

const variantStyles: Record<Variant, { indicator: string; active: string; fallback: string }> = {
  underline: {
    indicator: "bottom-0 h-0.5 translate-y-px rounded-full bg-foreground",
    active: "text-foreground",
    fallback: "group-data-[marker=off]/list:shadow-[inset_0_-2px_0_var(--foreground)]",
  },
  pill: {
    indicator: "inset-y-1 rounded-md bg-foreground",
    active: "text-background",
    fallback: "group-data-[marker=off]/list:bg-foreground",
  },
  segment: {
    indicator: "inset-y-1 rounded-md bg-background shadow-sm ring-1 ring-border/60",
    active: "text-foreground",
    fallback: "group-data-[marker=off]/list:bg-background",
  },
};

const useIsoLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

const reducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Tabs with one indicator that slides between them. When the tabs outgrow the strip it
 * scrolls sideways behind soft fades, with arrows that show only while there is more.
 */
export function NavTabs({
  tabs,
  value,
  defaultValue,
  onValueChange,
  variant = "underline",
  activation = "automatic",
  keepMounted = false,
  getHref,
  renderLink = (props) => <a {...props} />,
  tone = "muted",
  size = "default",
  disabled = false,
  panelClassName,
  "aria-label": ariaLabel = "Tabs",
  className,
}: NavTabsProps) {
  const baseId = React.useId();
  const firstEnabled = tabs.find((tab) => !tab.disabled)?.value;
  const [inner, setInner] = React.useState(defaultValue ?? firstEnabled);
  const current = tabs.some((tab) => tab.value === (value ?? inner)) ? (value ?? inner) : firstEnabled;
  const currentIndex = tabs.findIndex((tab) => tab.value === current);
  // Roving focus: the tab that holds the tab stop, which in manual mode can differ from the current one
  const [focusIndex, setFocusIndex] = React.useState(currentIndex);
  const hasPanels = !getHref && tabs.some((tab) => tab.content !== undefined);
  const styles = variantStyles[variant];
  // Links are navigation, so the strip becomes a labelled nav instead of a tablist
  const Root = getHref ? "nav" : "div";
  const surfaced = variant !== "underline";

  const select = (next: string) => {
    if (disabled || next === current) return;
    if (value === undefined) setInner(next);
    onValueChange?.(next);
  };

  React.useEffect(() => {
    setFocusIndex(currentIndex);
  }, [currentIndex]);

  const scrollerRef = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);
  const stripRef = React.useRef<HTMLDivElement>(null);
  const tabRefs = React.useRef<(HTMLElement | null)[]>([]);

  // Which edges have more to scroll to: drives the fades and the arrows, written straight to the DOM
  const updateEdges = React.useCallback(() => {
    const scroller = scrollerRef.current;
    const strip = stripRef.current;
    if (!scroller || !strip) return;
    const max = scroller.scrollWidth - scroller.clientWidth;
    const left = scroller.scrollLeft > 1;
    const right = scroller.scrollLeft < max - 1;
    strip.dataset.canLeft = String(left);
    strip.dataset.canRight = String(right);
    strip.style.setProperty("--tabs-fade-l", left ? `${FADE}px` : "0px");
    strip.style.setProperty("--tabs-fade-r", right ? `${FADE}px` : "0px");
  }, []);

  // The indicator's place is measured from the current tab and written to CSS variables
  const placeIndicator = React.useCallback(
    (instant: boolean) => {
      const list = listRef.current;
      const active = tabRefs.current[currentIndex];
      if (!list) return;
      if (!active) {
        list.dataset.marker = "off";
        return;
      }
      if (instant || list.dataset.marker !== "on") list.dataset.instant = "true";
      list.style.setProperty("--tabs-x", `${active.offsetLeft}px`);
      list.style.setProperty("--tabs-w", `${active.offsetWidth}px`);
      list.dataset.marker = "on";
      if (list.dataset.instant) {
        void list.offsetWidth;
        delete list.dataset.instant;
      }
    },
    [currentIndex],
  );

  // Keeps the current tab clear of the fades; lands at once on first paint
  const revealed = React.useRef(false);
  const reveal = React.useCallback(() => {
    const scroller = scrollerRef.current;
    const active = tabRefs.current[currentIndex];
    if (!scroller || !active) return;
    const start = active.offsetLeft - FADE;
    const end = active.offsetLeft + active.offsetWidth + FADE - scroller.clientWidth;
    let target = scroller.scrollLeft;
    if (start < target) target = Math.max(0, start);
    else if (end > target) target = end;
    if (target !== scroller.scrollLeft) {
      scroller.scrollTo({ left: target, behavior: revealed.current && !reducedMotion() ? "smooth" : "auto" });
    }
    revealed.current = true;
  }, [currentIndex]);

  useIsoLayoutEffect(() => {
    placeIndicator(false);
    reveal();
    updateEdges();
  }, [placeIndicator, reveal, updateEdges, variant, size]);

  React.useEffect(() => {
    const scroller = scrollerRef.current;
    const list = listRef.current;
    if (!scroller || !list) return;
    const ro = new ResizeObserver(() => {
      placeIndicator(true);
      updateEdges();
    });
    ro.observe(scroller);
    ro.observe(list);
    return () => ro.disconnect();
  }, [placeIndicator, updateEdges]);

  const scrollBy = (direction: 1 | -1) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.scrollBy({ left: direction * scroller.clientWidth * 0.7, behavior: reducedMotion() ? "auto" : "smooth" });
  };

  const moveFocus = (from: number, step: 1 | -1 | "first" | "last") => {
    const enabled = tabs.map((tab, index) => ({ tab, index })).filter(({ tab }) => !tab.disabled);
    if (enabled.length === 0) return;
    let target: number | undefined;
    if (step === "first") target = enabled[0]?.index;
    else if (step === "last") target = enabled[enabled.length - 1]?.index;
    else {
      const position = enabled.findIndex(({ index }) => index === from);
      const next = (position + step + enabled.length) % enabled.length;
      target = enabled[next]?.index;
    }
    if (target === undefined) return;
    setFocusIndex(target);
    tabRefs.current[target]?.focus();
    const tab = tabs[target];
    if (tab && activation === "automatic") select(tab.value);
  };

  const onKeyDown = (event: React.KeyboardEvent, index: number) => {
    const keys: Record<string, 1 | -1 | "first" | "last"> = { ArrowRight: 1, ArrowLeft: -1, Home: "first", End: "last" };
    const step = keys[event.key];
    if (step === undefined) return;
    event.preventDefault();
    moveFocus(index, step);
  };

  const tabClass = cn(
    "relative z-10 inline-flex h-(--tabs-item) shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap rounded-md px-3 font-medium outline-none select-none",
    // An inset ring: the scroller clips anything drawn outside a tab
    "text-muted-foreground transition-colors duration-300 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
    "aria-disabled:pointer-events-none aria-disabled:opacity-40 disabled:pointer-events-none disabled:opacity-40",
    variant === "underline" && "rounded-sm px-1",
  );

  const renderTab = (tab: NavTab, index: number) => {
    const active = index === currentIndex;
    const Icon = tab.icon;
    const inner = (
      <>
        {Icon && <Icon aria-hidden="true" className="size-(--tabs-icon) shrink-0" />}
        <span>{tab.label}</span>
        {tab.count !== undefined && (
          <span className="min-w-5 rounded-full bg-current/12 px-1.5 text-center text-sm leading-5 tabular-nums">{tab.count}</span>
        )}
      </>
    );
    const className = cn(tabClass, active && cn(styles.active, styles.fallback));
    const ref = (el: HTMLElement | null) => {
      tabRefs.current[index] = el;
    };

    if (getHref) {
      if (tab.disabled || disabled) {
        return (
          <a key={tab.value} ref={ref} aria-disabled="true" role="link" className={className}>
            {inner}
          </a>
        );
      }
      return (
        <React.Fragment key={tab.value}>
          {renderLink({
            href: getHref(tab.value),
            "aria-current": active ? "page" : undefined,
            onClick: () => select(tab.value),
            className,
            ref: ref as React.Ref<HTMLAnchorElement>,
            children: inner,
          } as NavTabLinkProps & { ref: React.Ref<HTMLAnchorElement> })}
        </React.Fragment>
      );
    }

    return (
      <button
        key={tab.value}
        ref={ref}
        type="button"
        role="tab"
        id={`${baseId}-tab-${index}`}
        aria-selected={active}
        aria-controls={hasPanels ? `${baseId}-panel-${index}` : undefined}
        tabIndex={index === focusIndex ? 0 : -1}
        disabled={tab.disabled || disabled}
        onClick={() => select(tab.value)}
        onFocus={() => setFocusIndex(index)}
        onKeyDown={(event) => onKeyDown(event, index)}
        className={className}
      >
        {inner}
      </button>
    );
  };

  const arrow =
    "absolute top-1/2 z-20 grid size-7 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-background text-foreground shadow-sm ring-1 ring-border transition-[opacity,scale] duration-300 hover:bg-muted";

  return (
    <Root
      data-slot="nav-tabs"
      data-variant={variant}
      aria-label={getHref ? ariaLabel : undefined}
      className={cn("flex min-w-0 flex-col gap-4", sizeStyles[size], disabled && "opacity-50", className)}
    >
      <div
        ref={stripRef}
        data-can-left="false"
        data-can-right="false"
        className={cn(
          "group/strip relative min-w-0",
          surfaced ? toneStyles[tone] : "border-b border-border",
        )}
      >
        {/* Mouse affordance only: the keyboard already reaches every tab through the arrow keys */}
        <button
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          onClick={() => scrollBy(-1)}
          className={cn(arrow, "left-1 scale-75 opacity-0 pointer-events-none group-data-[can-left=true]/strip:pointer-events-auto group-data-[can-left=true]/strip:scale-100 group-data-[can-left=true]/strip:opacity-100")}
          style={{ transitionTimingFunction: SPRING_EASE }}
        >
          <ChevronLeft className="size-4" />
        </button>
        <div
          ref={scrollerRef}
          onScroll={updateEdges}
          className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [mask-image:linear-gradient(to_right,transparent,black_var(--tabs-fade-l,0px),black_calc(100%-var(--tabs-fade-r,0px)),transparent)]"
        >
          <div
            ref={listRef}
            role={getHref ? undefined : "tablist"}
            aria-label={getHref ? undefined : ariaLabel}
            aria-orientation={getHref ? undefined : "horizontal"}
            data-marker="off"
            className={cn("group/list relative flex w-max min-w-full items-center", surfaced ? "gap-1 p-1" : "gap-5")}
          >
            <span
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute left-0 w-(--tabs-w) translate-x-(--tabs-x) opacity-0",
                "group-data-[marker=on]/list:opacity-100 motion-safe:transition-[translate,width] motion-safe:duration-500 group-data-[instant=true]/list:transition-none",
                styles.indicator,
              )}
              style={{ transitionTimingFunction: SPRING_EASE }}
            />
            {tabs.map(renderTab)}
          </div>
        </div>
        <button
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          onClick={() => scrollBy(1)}
          className={cn(arrow, "right-1 scale-75 opacity-0 pointer-events-none group-data-[can-right=true]/strip:pointer-events-auto group-data-[can-right=true]/strip:scale-100 group-data-[can-right=true]/strip:opacity-100")}
          style={{ transitionTimingFunction: SPRING_EASE }}
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      {hasPanels &&
        tabs.map((tab, index) => {
          const active = index === currentIndex;
          if (!active && !keepMounted) return null;
          return (
            <div
              key={active ? `active-${tab.value}` : tab.value}
              role="tabpanel"
              id={`${baseId}-panel-${index}`}
              aria-labelledby={`${baseId}-tab-${index}`}
              hidden={!active}
              tabIndex={0}
              className={cn(
                "rounded-md text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring",
                "transition-[opacity,translate] duration-300 motion-safe:starting:translate-y-1 starting:opacity-0",
                panelClassName,
              )}
            >
              {tab.content}
            </div>
          );
        })}

    </Root>
  );
}

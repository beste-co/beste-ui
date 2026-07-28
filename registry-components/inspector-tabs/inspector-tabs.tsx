"use client";

import type { LucideIcon } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

/** Surface treatment of the strip. Mirrors inspector-slider. */
type Tone = "muted" | "outline" | "ghost";

/** Strip height preset. Mirrors inspector-slider's row heights. */
type Size = "sm" | "default" | "lg";

const toneStyles: Record<Tone, string> = {
  muted: "border border-transparent bg-muted",
  outline: "border border-border",
  ghost: "border border-transparent",
};

const sizeStyles: Record<Size, string> = {
  sm: "[--inspector-height:--spacing(8)] [--inspector-pad:--spacing(2.5)]",
  default: "[--inspector-height:--spacing(9)] [--inspector-pad:--spacing(3)]",
  lg: "[--inspector-height:--spacing(11)] [--inspector-pad:--spacing(4)]",
};

interface InspectorTab {
  /** Reported on selection, and what a controlled value is matched against. */
  value: string;
  /** How it reads. Falls back to `value`. */
  label?: string;
  /** Leading glyph. On its own, with no label, it needs `label` for the tooltip. */
  icon?: LucideIcon;
  /**
   * A count beside the label. How many settings under this tab differ from their
   * defaults, usually: a tab that hides changes is worse than no tab at all.
   */
  badge?: React.ReactNode;
  /**
   * Id of the element this tab shows, when the caller renders one. It is the only
   * thing that ties a strip to a body, and without it the strip is simply a
   * switcher, which is a thing panels need on its own.
   */
  controls?: string;
  disabled?: boolean;
}

interface InspectorTabsProps {
  /** The tabs, in the order they are shown. */
  tabs?: InspectorTab[];

  /** Controlled selection, by `value`. Pair it with `onValueChange`. */
  value?: string;
  /** Initial selection in uncontrolled mode. Falls back to the first tab. */
  defaultValue?: string;
  onValueChange?: (value: string) => void;

  /** Block interaction and dim the strip. */
  disabled?: boolean;
  /**
   * Surface treatment of the strip: filled (default), hairline outline, or bare.
   * @defaultValue "muted" */
  tone?: Tone;
  /**
   * Strip height preset.
   * @defaultValue "default" */
  size?: Size;

  className?: string;
  /** Accessible name for the strip. */
  "aria-label"?: string;
}

export const inspectorTabsDemo: InspectorTabsProps = {
  className: "w-72",
  tabs: [
    { value: "design", label: "Design" },
    { value: "content", label: "Content", badge: 2 },
  ],
};

/**
 * The other thing a panel is made of. inspector-group puts a handful of rows away
 * behind a heading; this splits the whole panel, which is the move a drawer needs
 * once it holds thirty rows that answer to two or three different questions.
 *
 * It is the strip and nothing else. It used to render a body under itself too, and
 * that was one job too many: what the tabs switch between is the panel's own layout,
 * held in the panel's own markup, next to the state that decides it. A component that
 * owns the strip and the body has to be told about both, and is then in the way of
 * every arrangement it did not anticipate. Point `controls` at your body if you have
 * one; a strip with no body at all is a switcher, which panels want just as often.
 */
export function InspectorTabs({
  tabs = [],
  value: valueProp,
  defaultValue,
  onValueChange,
  disabled = false,
  tone = "muted",
  size = "default",
  className,
  "aria-label": ariaLabel,
}: InspectorTabsProps) {
  const [internalValue, setInternalValue] = React.useState(
    defaultValue ?? tabs[0]?.value ?? "",
  );
  const value = valueProp ?? internalValue;

  const baseId = React.useId();
  const stripRef = React.useRef<HTMLDivElement | null>(null);

  const activeIndex = Math.max(
    tabs.findIndex((tab) => tab.value === value),
    0,
  );
  const select = (next: string) => {
    if (valueProp === undefined) setInternalValue(next);
    onValueChange?.(next);
  };

  /*
   * Automatic activation: an arrow key both moves and selects. That is the pattern
   * for a tab set whose panels are already in the document and cost nothing to show,
   * and it is what a reader stepping through a panel expects. The alternative asks
   * them to press Enter after every arrow.
   */
  const move = (delta: number) => {
    if (tabs.length === 0) return;
    let next = activeIndex;
    for (let attempt = 0; attempt < tabs.length; attempt += 1) {
      next = (next + delta + tabs.length) % tabs.length;
      if (!tabs[next]?.disabled) break;
    }
    const target = tabs[next];
    if (!target || target.disabled) return;
    select(target.value);
    // Focus follows the selection, or the next arrow starts from where the
    // keyboard was rather than from what is on screen.
    stripRef.current
      ?.querySelectorAll<HTMLButtonElement>("[data-slot=inspector-tabs-tab]")
      ?.[next]?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();
        move(1);
        break;
      case "ArrowLeft":
        event.preventDefault();
        move(-1);
        break;
      case "Home": {
        event.preventDefault();
        const first = tabs.find((tab) => !tab.disabled);
        if (first) select(first.value);
        break;
      }
      case "End": {
        event.preventDefault();
        const last = [...tabs].reverse().find((tab) => !tab.disabled);
        if (last) select(last.value);
        break;
      }
      default:
        break;
    }
  };

  return (
    <div
      ref={stripRef}
      data-slot="inspector-tabs"
      data-disabled={disabled}
      className={cn(
        "h-(--inspector-height) rounded-(--inspector-radius) p-1",
        "[--inspector-radius:var(--radius-xl)]",
        "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
        sizeStyles[size],
        toneStyles[tone],
        className,
      )}
    >
      {/*
        A grid of equal columns rather than a row of flexible ones, which is what lets
        the pill below be placed by index alone: no measuring, and the slide runs on
        the compositor. It is the same arrangement inspector-segmented uses, and the
        reason this strip can afford it is that every tab is the same width by
        construction, whatever its label says.

        The tablist is this inner element rather than the padded surface around it, so
        the marker can be positioned against the space the tabs actually occupy.
      */}
      <div
        role="tablist"
        aria-label={ariaLabel}
        aria-orientation="horizontal"
        onKeyDown={handleKeyDown}
        data-slot="inspector-tabs-list"
        className="relative grid h-full items-center"
        style={{ gridTemplateColumns: `repeat(${Math.max(tabs.length, 1)}, minmax(0, 1fr))` }}
      >
        <span
          aria-hidden="true"
          data-slot="inspector-tabs-marker"
          className={cn(
            "pointer-events-none absolute inset-y-0 left-0 rounded-lg bg-background shadow-sm",
            "motion-safe:transition-transform motion-safe:duration-200",
          )}
          style={{
            width: `${100 / Math.max(tabs.length, 1)}%`,
            transform: `translateX(${activeIndex * 100}%)`,
          }}
        />

        {tabs.map((tab, index) => {
          const isActive = index === activeIndex;
          const TabIcon = tab.icon;

          return (
            <button
              key={tab.value}
              type="button"
              role="tab"
              id={`${baseId}-tab-${tab.value}`}
              aria-selected={isActive}
              aria-controls={tab.controls}
              tabIndex={isActive ? 0 : -1}
              disabled={disabled || tab.disabled}
              title={tab.label ?? tab.value}
              onClick={() => select(tab.value)}
              data-slot="inspector-tabs-tab"
              data-active={isActive || undefined}
              className={cn(
                // `relative`, so the tab sits over the marker sliding underneath it.
                "relative flex h-full min-w-0 cursor-pointer items-center justify-center gap-1.5",
                "rounded-lg px-2",
                "text-sm font-medium transition-colors select-none",
                "outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                "disabled:pointer-events-none disabled:opacity-40",
                isActive ? "text-foreground" : "text-foreground/70 hover:text-foreground",
              )}
            >
              {TabIcon ? <TabIcon className="size-4 shrink-0" /> : null}
              {tab.label ? <span className="truncate">{tab.label}</span> : null}
              {tab.badge !== undefined && tab.badge !== null ? (
                <span
                  data-slot="inspector-tabs-badge"
                  className={cn(
                    "flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full px-1",
                    "text-sm tabular-nums",
                    isActive ? "bg-foreground/10 text-foreground" : "bg-foreground/10",
                  )}
                >
                  {tab.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import * as React from "react";
import { PriceTag } from "@/components/beste/component/price-tag";
import { cn } from "@/lib/utils";

/** Surface of the switch. Mirrors the inspector family. */
type Tone = "muted" | "outline" | "ghost";

/** Density preset. Mirrors the inspector family; `sm` still sets text-sm. */
type Size = "sm" | "default" | "lg";

export interface PriceToggleOption {
  value: string;
  label: string;
  /** A short badge beside the label, e.g. "Save 20%". It pops when this option is picked. */
  badge?: string;
}

export interface PriceToggleProps {
  /** The periods to choose from. Defaults to Monthly and Yearly. */
  options?: PriceToggleOption[];
  /** The picked period, controlled. */
  value?: string;
  /** The picked period, uncontrolled. Defaults to the first option. */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Rendered under the switch with the picked period, e.g. a PriceTag whose amount follows it. */
  children?: (value: string) => React.ReactNode;
  /** Accessible name for the group. */
  "aria-label"?: string;
  /** Form name for the underlying radios. */
  name?: string;
  disabled?: boolean;
  tone?: Tone;
  size?: Size;
  className?: string;
}

const DEFAULT_OPTIONS: PriceToggleOption[] = [
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly", badge: "2 months free" },
];

const PRICES: Record<string, { amount: number; period: string; periodLabel: string }> = {
  monthly: { amount: 12, period: "/mo", periodLabel: "per month" },
  yearly: { amount: 120, period: "/yr", periodLabel: "per year" },
};

export const priceToggleDemo: PriceToggleProps = {
  defaultValue: "monthly",
  "aria-label": "Billing period",
  className: "w-fit items-center",
  children: (period) => {
    const price = PRICES[period] ?? PRICES.monthly;
    return price ? <PriceTag amount={price.amount} currency="USD" locale="en-US" period={price.period} periodLabel={price.periodLabel} symbol="raised" size="lg" /> : null;
  },
};

// Same spring as inspector-slider, for the thumb landing and the badge pop
const SPRING_EASE =
  "linear(0, 0.014, 0.056 3.4%, 0.216 7.2%, 0.472 11.6%, 0.72 16%, 0.895 20%, 0.986 23.6%, 1.036 27.8%, 1.045 32.4%, 1.026 39.4%, 0.998 46.6%, 0.992 52.4%, 1.001 66.4%, 1)";

const toneStyles: Record<Tone, { track: string; thumb: string }> = {
  muted: { track: "bg-muted p-1", thumb: "bg-background shadow-sm" },
  outline: { track: "border border-border bg-background p-1", thumb: "bg-muted" },
  ghost: { track: "p-1", thumb: "bg-muted" },
};

const sizeStyles: Record<Size, { option: string; badge: string }> = {
  sm: { option: "h-8 gap-1.5 px-3 text-sm", badge: "h-5 px-1.5 text-sm" },
  default: { option: "h-9 gap-2 px-4 text-sm", badge: "h-6 px-2 text-sm" },
  lg: { option: "h-11 gap-2 px-5 text-base", badge: "h-6 px-2 text-sm" },
};

const useIsomorphicLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

/**
 * A billing period switch: a thumb that slides between the periods on the family spring and a
 * savings badge that pops when its period is picked. Built from radios, so arrow keys and forms just work.
 */
export function PriceToggle({
  options = DEFAULT_OPTIONS,
  value: valueProp,
  defaultValue,
  onValueChange,
  children,
  "aria-label": ariaLabel = "Billing period",
  name,
  disabled = false,
  tone = "muted",
  size = "default",
  className,
}: PriceToggleProps) {
  const fallback = defaultValue ?? options[0]?.value ?? "";
  const [inner, setInner] = React.useState(fallback);
  const value = valueProp ?? inner;
  const groupName = React.useId();
  const trackRef = React.useRef<HTMLDivElement>(null);
  const optionRefs = React.useRef(new Map<string, HTMLLabelElement>());
  const badgeRefs = React.useRef(new Map<string, HTMLSpanElement>());
  const placedOnce = React.useRef(false);

  const pick = (next: string) => {
    if (next === value || disabled) return;
    if (valueProp === undefined) setInner(next);
    onValueChange?.(next);
    const badge = badgeRefs.current.get(next);
    if (badge && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      badge.animate([{ scale: "1" }, { scale: "1.18" }, { scale: "1" }], { duration: 520, easing: SPRING_EASE });
    }
  };

  // The thumb is measured from the picked option, so labels of any length fit; the first placement lands without a slide
  useIsomorphicLayoutEffect(() => {
    const track = trackRef.current;
    const option = optionRefs.current.get(value);
    if (!track || !option) return;
    const place = () => {
      track.style.setProperty("--toggle-x", `${option.offsetLeft}px`);
      track.style.setProperty("--toggle-w", `${option.offsetWidth}px`);
    };
    if (!placedOnce.current) {
      track.dataset.instant = "true";
      place();
      track.dataset.placed = "true";
      placedOnce.current = true;
      requestAnimationFrame(() => delete track.dataset.instant);
    } else {
      place();
    }
    const ro = new ResizeObserver(() => {
      track.dataset.instant = "true";
      place();
      requestAnimationFrame(() => delete track.dataset.instant);
    });
    ro.observe(option);
    return () => ro.disconnect();
  }, [value, options]);

  const t = toneStyles[tone];
  const s = sizeStyles[size];

  return (
    <div data-slot="price-toggle" className={cn("inline-flex flex-col gap-5", className)}>
      <div
        ref={trackRef}
        role="radiogroup"
        aria-label={ariaLabel}
        aria-disabled={disabled || undefined}
        className={cn("group/toggle relative inline-flex w-fit select-none rounded-full", t.track, disabled && "opacity-50")}
      >
        {/* The thumb: hidden until measured, so the server render never shows it in the wrong place */}
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute top-1 bottom-1 left-0 w-(--toggle-w) translate-x-(--toggle-x) rounded-full opacity-0",
            "group-data-[placed=true]/toggle:opacity-100 motion-safe:transition-[translate,width] motion-safe:duration-500 group-data-[instant=true]/toggle:transition-none",
            t.thumb,
          )}
          style={{ transitionTimingFunction: SPRING_EASE }}
        />
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <label
              key={option.value}
              ref={(node) => {
                if (node) optionRefs.current.set(option.value, node);
                else optionRefs.current.delete(option.value);
              }}
              data-selected={selected}
              className={cn(
                "relative inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-full font-medium transition-colors duration-200",
                "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring",
                selected ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                disabled && "cursor-not-allowed",
                s.option,
              )}
            >
              <input
                type="radio"
                className="sr-only"
                name={name ?? groupName}
                value={option.value}
                checked={selected}
                disabled={disabled}
                onChange={() => pick(option.value)}
              />
              {option.label}
              {option.badge && (
                <span
                  ref={(node) => {
                    if (node) badgeRefs.current.set(option.value, node);
                    else badgeRefs.current.delete(option.value);
                  }}
                  className={cn(
                    "inline-flex items-center rounded-full font-medium transition-colors duration-300",
                    selected ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400" : "bg-foreground/[0.06] text-muted-foreground",
                    s.badge,
                  )}
                >
                  {option.badge}
                </span>
              )}
            </label>
          );
        })}
      </div>
      {children && <div data-slot="price-toggle-content">{children(value)}</div>}
    </div>
  );
}

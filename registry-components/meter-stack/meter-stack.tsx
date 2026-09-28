"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** Surface of the track. Mirrors the inspector family. */
type Tone = "muted" | "outline" | "ghost";

/** Bar height and type scale. Mirrors the inspector family. */
type Size = "sm" | "default" | "lg";

export interface MeterSegment {
  label: string;
  value: number;
  /** Any CSS color. Defaults to the theme's chart colors in turn. */
  color?: string;
}

export interface MeterStackProps {
  segments: MeterSegment[];
  /** Capacity. Defaults to the sum of the segments, so the bar is full. */
  max?: number;
  /** What is measured, above the bar and as the accessible name. */
  label?: string;
  /** Writes a value, e.g. with `formatBytes`. Defaults to a plain number. */
  formatValue?: (value: number) => string;
  /** Share of `max` from which the total turns amber. */
  warningAt?: number;
  /** Share of `max` from which the total turns red. */
  dangerAt?: number;
  /** The total line, e.g. "38.4 GB of 50 GB used". */
  showTotal?: boolean;
  /** The legend under the bar. */
  showLegend?: boolean;
  /** Label for the unused part in the legend and the tooltip. `null` leaves it out. */
  freeLabel?: string | null;
  locale?: string;
  tone?: Tone;
  size?: Size;
  className?: string;
}

/** Bytes written with the locale's unit names: 38.4 GB, 812 MB. */
export function formatBytes(bytes: number, locale = "en-US") {
  const units = ["byte", "kilobyte", "megabyte", "gigabyte", "terabyte", "petabyte"] as const;
  let value = Math.max(0, bytes);
  let index = 0;
  while (value >= 1000 && index < units.length - 1) {
    value /= 1000;
    index++;
  }
  return new Intl.NumberFormat(locale, { style: "unit", unit: units[index], unitDisplay: "short", maximumFractionDigits: value < 10 && index > 0 ? 1 : 0 }).format(value);
}

/** A share of the whole written as a percent, with a decimal only for small shares. */
const percentOf = (value: number, locale: string, reference = value) =>
  new Intl.NumberFormat(locale, { style: "percent", maximumFractionDigits: reference < 0.1 ? 1 : 0 }).format(value);

const GB = 1e9;

export const meterStackDemo: MeterStackProps = {
  label: "Studio drive",
  segments: [
    { label: "Stems", value: 18.6 * GB },
    { label: "Mixes", value: 9.2 * GB },
    { label: "Video", value: 7.1 * GB },
    { label: "Photos", value: 2.4 * GB },
    { label: "Other", value: 1.1 * GB },
  ],
  max: 50 * GB,
  formatValue: (value) => formatBytes(value),
  className: "w-full max-w-md",
};

// Soft ease-out without overshoot: a spring past the end would open a gap between segments
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const FILL_MS = 900;
const PALETTE = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

const toneStyles: Record<Tone, string> = {
  muted: "bg-muted",
  outline: "bg-background ring-1 ring-inset ring-border",
  ghost: "bg-foreground/5",
};

const sizeStyles: Record<Size, { bar: string; gap: number; text: string; total: string }> = {
  sm: { bar: "h-2", gap: 2, text: "text-sm", total: "text-sm" },
  default: { bar: "h-3", gap: 3, text: "text-sm", total: "text-base" },
  lg: { bar: "h-4", gap: 4, text: "text-base", total: "text-lg" },
};

/**
 * A stacked usage bar: each part a colored segment with a small gap, growing in on mount
 * while the total counts up with it; hover a part or its legend entry to single it out.
 */
export function MeterStack({
  segments,
  max: maxProp,
  label,
  formatValue = (value) => Math.round(value).toLocaleString("en-US"),
  warningAt = 0.8,
  dangerAt = 0.95,
  showTotal = true,
  showLegend = true,
  freeLabel = "Free",
  locale = "en-US",
  tone = "muted",
  size = "default",
  className,
}: MeterStackProps) {
  const [mounted, setMounted] = React.useState(false);
  const [active, setActive] = React.useState<number | null>(null);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const barRef = React.useRef<HTMLDivElement>(null);
  const usedRef = React.useRef<HTMLSpanElement>(null);
  const shareRef = React.useRef<HTMLSpanElement>(null);
  const shown = React.useRef(0);
  const format = React.useRef(formatValue);
  format.current = formatValue;

  React.useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const parts = segments.filter((segment) => segment.value > 0);
  const used = parts.reduce((sum, segment) => sum + segment.value, 0);
  const max = Math.max(maxProp ?? used, used, Number.EPSILON);
  const share = used / max;
  const free = Math.max(0, max - used);
  const status = share >= dangerAt ? "danger" : share >= warningAt ? "warning" : "neutral";
  const s = sizeStyles[size];
  const percent = (value: number) => percentOf(value, locale);
  const usedText = format.current(used);
  const maxText = format.current(max);

  // The total counts along with the fill: same duration and curve, written straight to the DOM
  React.useEffect(() => {
    if (!mounted) return;
    const from = shown.current;
    const write = (reading: number) => {
      shown.current = reading;
      if (usedRef.current) usedRef.current.textContent = format.current(reading);
      // Counted at the final figure's precision, so "9.5%" never outgrows a final "79%"
      if (shareRef.current) shareRef.current.textContent = percentOf(reading / max, locale, used / max);
    };
    if (from === used || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return write(used);
    write(from);
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const k = Math.min(1, (now - start) / FILL_MS);
      write(from + (used - from) * (1 - (1 - k) ** 4));
      if (k < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [mounted, used, max, locale]);

  const gaps = Math.max(0, parts.length - 1) * s.gap;
  const activePart = active !== null ? (active === parts.length ? { label: freeLabel ?? "", value: free } : parts[active]) : undefined;

  // The tooltip sits over the middle of the hovered segment, measured once per hover
  const tipRef = React.useRef<HTMLDivElement>(null);
  React.useLayoutEffect(() => {
    const bar = barRef.current;
    const tip = tipRef.current;
    if (!bar || !tip || active === null) return;
    const node = bar.querySelector<HTMLElement>(`[data-index="${active}"]`);
    if (!node) return;
    const center = node.offsetLeft + node.offsetWidth / 2;
    const x = Math.min(bar.offsetWidth - tip.offsetWidth / 2, Math.max(tip.offsetWidth / 2, center));
    tip.style.setProperty("--tip-x", `${x}px`);
  }, [active]);

  const written = `${usedText} of ${maxText} used, ${percent(share)}`;

  return (
    <div
      ref={rootRef}
      data-slot="meter-stack"
      data-status={status}
      role="meter"
      aria-label={label ?? "Usage"}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={used}
      aria-valuetext={written}
      className={cn("flex flex-col gap-3 text-foreground", className)}
    >
      {(label || showTotal) && (
        <div className={cn("flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 select-none", s.text)}>
          {label && <span className="font-medium">{label}</span>}
          {showTotal && (
            <span
              aria-hidden="true"
              className={cn(
                "text-muted-foreground tabular-nums transition-opacity duration-300",
                mounted ? "opacity-100" : "opacity-0",
              )}
            >
              {/* The final figures sit invisibly underneath, so the line never changes width while it counts */}
              <span className="inline-grid">
                <span className="invisible col-start-1 row-start-1">{usedText}</span>
                <span
                  ref={usedRef}
                  className={cn(
                    "col-start-1 row-start-1 font-semibold",
                    s.total,
                    status === "danger" ? "text-destructive" : status === "warning" ? "text-amber-600 dark:text-amber-400" : "text-foreground",
                  )}
                >
                  {usedText}
                </span>
              </span>{" "}
              of {maxText} used ·{" "}
              <span className="inline-grid">
                <span className="invisible col-start-1 row-start-1">{percent(share)}</span>
                <span ref={shareRef} className="col-start-1 row-start-1">
                  {percent(share)}
                </span>
              </span>
            </span>
          )}
        </div>
      )}

      <div className="relative">
        <div
          ref={barRef}
          aria-hidden="true"
          className={cn("flex w-full overflow-hidden rounded-full", toneStyles[tone], s.bar)}
          style={{ gap: s.gap }}
          onPointerLeave={() => setActive(null)}
        >
          {parts.map((segment, index) => (
            <div
              key={`${segment.label}-${index}`}
              data-index={index}
              onPointerEnter={() => setActive(index)}
              className={cn(
                "h-full shrink-0 cursor-pointer motion-safe:transition-[width,opacity] motion-safe:duration-[900ms]",
                active !== null && active !== index && "opacity-35",
              )}
              style={{
                width: mounted ? `calc((100% - ${gaps}px) * ${segment.value / max})` : "0px",
                backgroundColor: segment.color ?? PALETTE[index % PALETTE.length],
                transitionTimingFunction: EASE,
                transitionDelay: mounted && active === null ? `${index * 60}ms` : "0ms",
              }}
            />
          ))}
          {free > 0 && freeLabel !== null && <div data-index={parts.length} onPointerEnter={() => setActive(parts.length)} className="h-full min-w-0 flex-1 cursor-pointer" />}
        </div>

        {activePart && (
          <div
            ref={tipRef}
            aria-hidden="true"
            className="pointer-events-none absolute bottom-full left-(--tip-x) z-10 mb-2 flex -translate-x-1/2 flex-col items-center rounded-md bg-foreground px-2.5 py-1.5 whitespace-nowrap text-background shadow-md motion-safe:transition-[opacity,translate,left] motion-safe:duration-200 motion-safe:starting:translate-y-1 starting:opacity-0"
            style={{ transitionTimingFunction: EASE }}
          >
            <span className="text-sm font-medium">{activePart.label}</span>
            <span className="text-sm tabular-nums opacity-80">
              {format.current(activePart.value)} · {percent(activePart.value / max)}
            </span>
          </div>
        )}
      </div>

      {showLegend && (
        <ul className={cn("flex flex-wrap gap-x-4 gap-y-1.5 select-none", s.text)}>
          {parts.map((segment, index) => (
            <li
              key={`${segment.label}-${index}`}
              tabIndex={0}
              aria-label={`${segment.label}, ${format.current(segment.value)}, ${percent(segment.value / max)}`}
              onPointerEnter={() => setActive(index)}
              onPointerLeave={() => setActive(null)}
              onFocus={() => setActive(index)}
              onBlur={() => setActive(null)}
              className={cn(
                "flex cursor-pointer items-center gap-1.5 rounded-sm outline-none transition-opacity duration-200 focus-visible:ring-2 focus-visible:ring-ring",
                active !== null && active !== index && "opacity-50",
              )}
            >
              <span aria-hidden="true" className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: segment.color ?? PALETTE[index % PALETTE.length] }} />
              <span>{segment.label}</span>
              <span className="text-muted-foreground tabular-nums">{format.current(segment.value)}</span>
            </li>
          ))}
          {free > 0 && freeLabel !== null && (
            <li
              tabIndex={0}
              aria-label={`${freeLabel}, ${format.current(free)}, ${percent(free / max)}`}
              onPointerEnter={() => setActive(parts.length)}
              onPointerLeave={() => setActive(null)}
              onFocus={() => setActive(parts.length)}
              onBlur={() => setActive(null)}
              className={cn(
                "flex cursor-pointer items-center gap-1.5 rounded-sm outline-none transition-opacity duration-200 focus-visible:ring-2 focus-visible:ring-ring",
                active !== null && active !== parts.length && "opacity-50",
              )}
            >
              <span aria-hidden="true" className={cn("size-2.5 shrink-0 rounded-full", toneStyles[tone])} />
              <span>{freeLabel}</span>
              <span className="text-muted-foreground tabular-nums">{format.current(free)}</span>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}

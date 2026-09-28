"use client";

import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import * as React from "react";
import { formatReadout, type ReadoutFormat } from "@/components/beste/component/readout-stat";
import { cn } from "@/lib/utils";

/** Surface treatment of the card. Mirrors the inspector family. */
type Tone = "muted" | "outline" | "ghost";

/** Density preset. Mirrors the inspector family. */
type Size = "sm" | "default" | "lg";

/** Which way a change counts as good news. */
type Direction = "up" | "down";

export interface ReadoutCompareRow {
  label: string;
  value: number;
  previous: number;
  /** Defaults to the card's format. */
  format?: ReadoutFormat;
  /** Defaults to the card's direction. */
  goodDirection?: Direction;
}

export interface ReadoutCompareProps {
  /** What is being measured, above the figure. */
  label: string;
  /** This period's figure. */
  value: number;
  /** The period it is compared with. */
  previous: number;
  format?: ReadoutFormat;
  /** ISO currency code, for `format="currency"`. */
  currency?: string;
  locale?: string;
  /** Most digits after the point. Each format has its own default. */
  fractionDigits?: number;
  /** Which way a change is good news. Revenue is `up`, churn is `down`. */
  goodDirection?: Direction;
  /** Name of this period, beside its bar. */
  currentLabel?: string;
  /** Name of the earlier period, beside its bar. */
  previousLabel?: string;
  /** Further metrics compared the same way, under the main one. */
  breakdown?: ReadoutCompareRow[];
  /** A short line at the foot of the card. */
  caption?: string;
  size?: Size;
  tone?: Tone;
  className?: string;
}

export const readoutCompareDemo: ReadoutCompareProps = {
  label: "Streams",
  value: 1_284_300,
  previous: 1_146_900,
  format: "compact",
  currentLabel: "Sep 2026",
  previousLabel: "Aug 2026",
  breakdown: [
    { label: "Spotify", value: 742_100, previous: 681_400 },
    { label: "Apple Music", value: 298_200, previous: 301_900 },
    { label: "Bandcamp", value: 96_400, previous: 71_800 },
  ],
  caption: "Joni Mitchell, every release",
  className: "w-full max-w-md",
};

/** Soft ease-out: bars grow in without the spring's overshoot, which would read as a wobble on a bar chart. */
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

const toneStyles: Record<Tone, string> = {
  muted: "border border-transparent bg-muted",
  outline: "border border-border",
  ghost: "border border-transparent",
};

const sizeStyles: Record<Size, { root: string; figure: string; bar: string; rowBar: string }> = {
  sm: { root: "gap-3 p-3", figure: "text-2xl", bar: "h-2", rowBar: "h-1.5" },
  default: { root: "gap-4 p-4", figure: "text-3xl", bar: "h-2.5", rowBar: "h-1.5" },
  lg: { root: "gap-5 p-5", figure: "text-4xl", bar: "h-3", rowBar: "h-2" },
};

/** The same good, bad and flat colors readout-stat uses. */
const deltaStyles = {
  good: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-400",
  bad: "bg-red-500/12 text-red-700 dark:text-red-400",
  flat: "bg-foreground/8 text-muted-foreground",
} as const;

/** The change between two figures as a fraction, its direction and whether it is good news. */
export function compareChange(value: number, previous: number, goodDirection: Direction = "up") {
  const change = previous === 0 ? (value === 0 ? 0 : Math.sign(value)) : (value - previous) / Math.abs(previous);
  const direction = Math.abs(change) < 0.0005 ? "flat" : change > 0 ? "up" : "down";
  const verdict = direction === "flat" ? "flat" : direction === goodDirection ? "good" : "bad";
  return { change, direction, verdict } as const;
}

function DeltaChip({ value, previous, goodDirection, locale }: { value: number; previous: number; goodDirection: Direction; locale: string }) {
  const { change, direction, verdict } = compareChange(value, previous, goodDirection);
  const Icon = direction === "up" ? ArrowUpRight : direction === "down" ? ArrowDownRight : Minus;
  const text = `${change > 0 ? "+" : ""}${new Intl.NumberFormat(locale, { style: "percent", maximumFractionDigits: 1 }).format(change)}`;
  return (
    <span
      aria-hidden="true"
      data-verdict={verdict}
      className={cn("inline-flex w-fit shrink-0 select-none items-center gap-1 rounded-full px-2 py-0.5 text-sm font-medium tabular-nums", deltaStyles[verdict])}
    >
      <Icon className="size-3.5" />
      {text}
    </span>
  );
}

/** Two bars on one scale: this period solid, the earlier one faint, both growing from the left on mount. */
function TwinBars({
  value,
  previous,
  shown,
  delay,
  height,
  labels,
  written,
}: {
  value: number;
  previous: number;
  shown: boolean;
  delay: number;
  height: string;
  labels?: [string, string];
  written: [string, string];
}) {
  const top = Math.max(Math.abs(value), Math.abs(previous), Number.EPSILON);
  const bars: { key: string; fraction: number; fill: string; text: string; label?: string; strong: boolean }[] = [
    { key: "current", fraction: Math.abs(value) / top, fill: "bg-foreground", text: written[0], label: labels?.[0], strong: true },
    { key: "previous", fraction: Math.abs(previous) / top, fill: "bg-foreground/25", text: written[1], label: labels?.[1], strong: false },
  ];
  return (
    <div
      aria-hidden="true"
      className={cn("grid items-center gap-x-3 gap-y-1.5", labels ? "grid-cols-[auto_minmax(0,1fr)_auto]" : "grid-cols-[minmax(0,1fr)_auto]")}
    >
      {bars.map((bar, index) => (
        <React.Fragment key={bar.key}>
          {labels && <span className="select-none whitespace-nowrap text-sm text-muted-foreground">{bar.label}</span>}
          <span className={cn("relative block overflow-hidden rounded-full bg-foreground/[0.06]", height)}>
            <span
              className={cn("absolute inset-0 origin-left rounded-full motion-safe:transition-transform motion-safe:duration-[900ms]", bar.fill)}
              style={{ transform: `scaleX(${shown ? bar.fraction : 0})`, transitionTimingFunction: EASE, transitionDelay: `${delay + index * 90}ms` }}
            />
          </span>
          <span className={cn("select-none whitespace-nowrap text-right text-sm tabular-nums", bar.strong ? "font-medium text-foreground" : "text-muted-foreground")}>
            {bar.text}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
}

/**
 * One metric across two periods: the figure, the change and a pair of bars on one scale,
 * with optional breakdown rows compared the same way.
 */
export function ReadoutCompare({
  label,
  value,
  previous,
  format = "number",
  currency = "USD",
  locale = "en-US",
  fractionDigits,
  goodDirection = "up",
  currentLabel = "This period",
  previousLabel = "Last period",
  breakdown,
  caption,
  size = "default",
  tone = "muted",
  className,
}: ReadoutCompareProps) {
  // The real figures render from the first paint; mounting only lets the figure settle in and the bars grow
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const s = sizeStyles[size];
  const write = (n: number, rowFormat: ReadoutFormat = format) => formatReadout(n, { format: rowFormat, currency, locale, fractionDigits });
  const main = compareChange(value, previous, goodDirection);
  const spokenChange = (change: number, verdict: string) =>
    verdict === "flat"
      ? "unchanged"
      : `${change > 0 ? "up" : "down"} ${new Intl.NumberFormat(locale, { style: "percent", maximumFractionDigits: 1 }).format(Math.abs(change))}, ${verdict === "good" ? "an improvement" : "a decline"}`;

  return (
    <section
      data-slot="readout-compare"
      data-trend={main.direction}
      className={cn("flex w-full flex-col rounded-xl text-foreground", toneStyles[tone], s.root, className)}
    >
      <p className="sr-only">
        {`${label}: ${write(value)} in ${currentLabel}, ${spokenChange(main.change, main.verdict)} from ${write(previous)} in ${previousLabel}.`}
      </p>

      <div aria-hidden="true" className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-3">
          <span className="select-none text-sm text-muted-foreground">{label}</span>
          <DeltaChip value={value} previous={previous} goodDirection={goodDirection} locale={locale} />
        </div>
        <div
          className={cn(
            "flex flex-wrap items-baseline gap-x-2 motion-safe:transition-[opacity,translate,filter] motion-safe:duration-700",
            !mounted && "motion-safe:translate-y-1.5 motion-safe:opacity-0 motion-safe:blur-[3px]",
          )}
          style={{ transitionTimingFunction: EASE }}
        >
          <span className={cn("select-none font-semibold leading-tight tracking-tight tabular-nums", s.figure)}>{write(value)}</span>
          <span className="select-none whitespace-nowrap text-sm text-muted-foreground tabular-nums">
            from {write(previous)}
          </span>
        </div>
      </div>

      <TwinBars
        value={value}
        previous={previous}
        shown={mounted}
        delay={120}
        height={s.bar}
        labels={[currentLabel, previousLabel]}
        written={[write(value), write(previous)]}
      />

      {breakdown && breakdown.length > 0 && (
        <ul className="flex flex-col gap-3 border-t border-foreground/10 pt-3">
          {breakdown.map((row, index) => {
            const rowFormat = row.format ?? format;
            const rowDirection = row.goodDirection ?? goodDirection;
            const change = compareChange(row.value, row.previous, rowDirection);
            return (
              <li key={`${row.label}-${index}`} className="flex flex-col gap-1.5">
                <span className="sr-only">
                  {`${row.label}: ${write(row.value, rowFormat)}, ${spokenChange(change.change, change.verdict)} from ${write(row.previous, rowFormat)}.`}
                </span>
                <div aria-hidden="true" className="flex items-center justify-between gap-3">
                  <span className="select-none text-sm font-medium">{row.label}</span>
                  <DeltaChip value={row.value} previous={row.previous} goodDirection={rowDirection} locale={locale} />
                </div>
                <TwinBars
                  value={row.value}
                  previous={row.previous}
                  shown={mounted}
                  delay={260 + index * 90}
                  height={s.rowBar}
                  written={[write(row.value, rowFormat), write(row.previous, rowFormat)]}
                />
              </li>
            );
          })}
        </ul>
      )}

      {caption && <p className="select-none text-sm text-muted-foreground">{caption}</p>}
    </section>
  );
}

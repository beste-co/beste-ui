"use client";

import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

/** Surface treatment of the readout. Mirrors the inspector family. */
type Tone = "muted" | "outline" | "ghost";

/** Density preset. Mirrors the inspector family. */
type Size = "sm" | "default" | "lg";

/** How the figure is written. */
export type ReadoutFormat = "number" | "currency" | "percent" | "compact";

/** Which way a change counts as good news. */
type Direction = "up" | "down";

/** Same spring the inspector family uses, so the digits land with the same feel. */
const SPRING_EASE =
  "linear(0, 0.014, 0.056 3.4%, 0.216 7.2%, 0.472 11.6%, 0.72 16%, 0.895 20%, 0.986 23.6%, 1.036 27.8%, 1.045 32.4%, 1.026 39.4%, 0.998 46.6%, 0.992 52.4%, 1.001 66.4%, 1)";

const toneStyles: Record<Tone, string> = {
  muted: "border border-transparent bg-muted",
  outline: "border border-border",
  ghost: "border border-transparent",
};

const sizeStyles: Record<Size, { root: string; figure: string; spark: string }> = {
  sm: { root: "gap-1.5 p-3", figure: "text-2xl", spark: "h-8 w-20" },
  default: { root: "gap-2 p-4", figure: "text-4xl", spark: "h-10 w-24" },
  lg: { root: "gap-2.5 p-5", figure: "text-5xl", spark: "h-12 w-28" },
};

/** Good, bad and flat, shared by the chip and the sparkline's last point. */
const deltaStyles = {
  good: { chip: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-400", dot: "bg-emerald-500 dark:bg-emerald-400" },
  bad: { chip: "bg-red-500/12 text-red-700 dark:text-red-400", dot: "bg-red-500 dark:bg-red-400" },
  flat: { chip: "bg-foreground/8 text-muted-foreground", dot: "bg-foreground/60" },
} as const;

/** Writes a figure the way the readout shows it. Siblings share it so a number reads the same everywhere. */
export function formatReadout(
  value: number,
  { format = "number", currency = "USD", locale = "en-US", fractionDigits }: { format?: ReadoutFormat; currency?: string; locale?: string; fractionDigits?: number } = {},
) {
  const options: Intl.NumberFormatOptions =
    format === "currency"
      ? { style: "currency", currency, maximumFractionDigits: fractionDigits ?? 0 }
      : format === "percent"
        ? { style: "percent", maximumFractionDigits: fractionDigits ?? 1 }
        : format === "compact"
          ? { notation: "compact", maximumFractionDigits: fractionDigits ?? 1 }
          : { maximumFractionDigits: fractionDigits ?? 0 };
  return new Intl.NumberFormat(locale, options).format(value);
}

interface ReadoutStatProps {
  /** What is being measured, above the figure. */
  label: string;
  /** The figure. Changing it rolls the digits to the new value. */
  value: number;
  format?: ReadoutFormat;
  /** ISO currency code, for `format="currency"`. */
  currency?: string;
  locale?: string;
  /** Most digits after the point. Each format has its own default. */
  fractionDigits?: number;
  /** The comparison value. The chip shows the change from it unless `delta` is given. */
  previous?: number;
  /** A ready-made change as a fraction (0.12 is +12%). Overrides `previous`. */
  delta?: number;
  /** Which way a change is good news. Revenue is `up`, churn is `down`. */
  goodDirection?: Direction;
  /** Recent values, oldest first, drawn as an inline sparkline. */
  trend?: number[];
  /** A short line under the figure, e.g. the period. */
  caption?: string;
  size?: Size;
  tone?: Tone;
  className?: string;
}

export const readoutStatDemo: ReadoutStatProps = {
  label: "Monthly revenue",
  value: 48_290,
  format: "currency",
  currency: "USD",
  previous: 42_870,
  goodDirection: "up",
  trend: [31, 34, 33, 37, 36, 40, 39, 43, 42.9, 45, 47, 48.3],
  caption: "Compared with August",
  className: "w-full max-w-xs",
};

/** One digit as a column of 0 to 9 in a one-line window, moved into place with a transform. */
function RollingDigit({ digit, delay }: { digit: number; delay: number }) {
  return (
    <span className="relative block h-[1.1em] overflow-hidden">
      <span className="invisible block">{digit}</span>
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 flex flex-col motion-safe:transition-transform motion-safe:duration-[900ms]"
        style={{ transform: `translateY(${-digit * 10}%)`, transitionTimingFunction: SPRING_EASE, transitionDelay: `${delay}ms` }}
      >
        {Array.from({ length: 10 }, (_, n) => (
          <span key={n} className="block h-[1.1em]">
            {n}
          </span>
        ))}
      </span>
    </span>
  );
}

/** Each character settles in on mount: up from below, out of a blur, staggered left to right. */
function Arrive({ entered, delay, children }: { entered: boolean; delay: number; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "block h-[1.1em] motion-safe:transition-[opacity,translate,filter] motion-safe:duration-700",
        !entered && "motion-safe:translate-y-[0.35em] motion-safe:opacity-0 motion-safe:blur-[4px]",
      )}
      style={{ transitionTimingFunction: SPRING_EASE, transitionDelay: entered ? `${delay}ms` : undefined }}
    >
      {children}
    </span>
  );
}

export function ReadoutStat({
  label,
  value,
  format = "number",
  currency = "USD",
  locale = "en-US",
  fractionDigits,
  previous,
  delta,
  goodDirection = "up",
  trend,
  caption,
  size = "default",
  tone = "muted",
  className,
}: ReadoutStatProps) {
  // The real figure renders from the first paint; mounting only lets it settle in
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const text = formatReadout(value, { format, currency, locale, fractionDigits });
  const chars = [...text];
  const digitCount = chars.filter((char) => /\d/.test(char)).length;
  let digitIndex = 0;

  const change = delta ?? (previous !== undefined && previous !== 0 ? (value - previous) / Math.abs(previous) : undefined);
  const trendDirection = change === undefined || Math.abs(change) < 0.0005 ? "flat" : change > 0 ? "up" : "down";
  const verdict = trendDirection === "flat" ? "flat" : trendDirection === goodDirection ? "good" : "bad";
  const DeltaIcon = trendDirection === "up" ? ArrowUpRight : trendDirection === "down" ? ArrowDownRight : Minus;
  const changeText =
    change === undefined
      ? null
      : `${change > 0 ? "+" : ""}${new Intl.NumberFormat(locale, { style: "percent", maximumFractionDigits: 1 }).format(change)}`;

  return (
    <div
      data-slot="readout-stat"
      data-trend={trendDirection}
      className={cn("flex w-full flex-col rounded-xl text-foreground", toneStyles[tone], sizeStyles[size].root, className)}
    >
      <span className="select-none text-sm text-muted-foreground">{label}</span>

      {/* Figure and chip on the left, the sparkline in a fixed column on the right: it never wraps under the figure */}
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
        <div className="flex min-w-0 flex-col gap-1.5">
          <span className="sr-only">{text}</span>
          <span
            aria-hidden="true"
            // Every character sits in the same 1.1em box and aligns to its top, so digits and separators share one line
            className={cn("flex select-none items-start font-semibold leading-[1.1] tracking-tight tabular-nums", sizeStyles[size].figure)}
          >
            {chars.map((char, index) => {
              if (!/\d/.test(char)) {
                return (
                  // biome-ignore lint/suspicious/noArrayIndexKey: separators keep their place in the written figure
                  <Arrive key={`c${index}`} entered={mounted} delay={index * 45}>
                    {char === " " || char === "\u00a0" || char === "\u202f" ? "\u00a0" : char}
                  </Arrive>
                );
              }
              // Digits are keyed from the right, so a new leading digit never shifts the others
              const fromRight = digitCount - 1 - digitIndex++;
              return (
                <Arrive key={`d${fromRight}`} entered={mounted} delay={index * 45}>
                  <RollingDigit digit={Number(char)} delay={fromRight * 40} />
                </Arrive>
              );
            })}
          </span>
          {changeText && (
            <span
              data-verdict={verdict}
              className={cn(
                "inline-flex w-fit select-none items-center gap-1 rounded-full px-2 py-0.5 text-sm font-medium tabular-nums",
                deltaStyles[verdict].chip,
              )}
            >
              <DeltaIcon aria-hidden="true" className="size-3.5" />
              {changeText}
              <span className="sr-only">{verdict === "good" ? ", an improvement" : verdict === "bad" ? ", a decline" : ", unchanged"}</span>
            </span>
          )}
        </div>

        {trend && trend.length > 1 && <Sparkline values={trend} dot={deltaStyles[verdict].dot} className={sizeStyles[size].spark} />}
      </div>

      {caption && <span className="select-none text-sm text-muted-foreground">{caption}</span>}
    </div>
  );
}

/** A small line of recent values that draws itself in, ending on a dot in the verdict's color. */
function Sparkline({ values, dot, className }: { values: number[]; dot: string; className?: string }) {
  const [drawn, setDrawn] = React.useState(false);
  const fadeId = React.useId();
  React.useEffect(() => {
    const frame = requestAnimationFrame(() => setDrawn(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  // Four units of headroom top and bottom keep the stroke and the dot inside the box
  const points = values.map((value, index) => [(index / (values.length - 1)) * 100, 28 - ((value - min) / span) * 24] as const);
  const line = points.map(([x, y], index) => `${index ? "L" : "M"}${x.toFixed(2)} ${y.toFixed(2)}`).join(" ");
  const last = points.at(-1) ?? [100, 16];
  const ease = { transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" };

  return (
    <div aria-hidden="true" className={cn("relative shrink-0 text-foreground/55", className)}>
      {/* Drawn in from the left with a clip, which stays exact whatever the stroke scaling */}
      <svg
        viewBox="0 0 100 32"
        preserveAspectRatio="none"
        className="size-full overflow-visible motion-safe:transition-[clip-path] motion-safe:duration-[1100ms]"
        style={{ clipPath: drawn ? "inset(-4px -4px -4px -4px)" : "inset(-4px 100% -4px -4px)", ...ease }}
      >
        <defs>
          <linearGradient id={fadeId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="currentColor" stopOpacity="0.18" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`${line} L100 32 L0 32 Z`} fill={`url(#${fadeId})`} />
        <path d={line} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      </svg>
      {/* An HTML dot, because the stretched SVG would squash a circle into an oval */}
      <span
        className={cn(
          "absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-background scale-0 motion-safe:transition-transform motion-safe:delay-[900ms] motion-safe:duration-500",
          drawn && "scale-100",
          dot,
        )}
        style={{ left: `${last[0]}%`, top: `${(last[1] / 32) * 100}%`, transitionTimingFunction: SPRING_EASE }}
      />
    </div>
  );
}

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** Surface of the track. Mirrors the inspector family. */
type Tone = "muted" | "outline" | "ghost";

/** Diameter preset. */
type Size = "sm" | "default" | "lg";

/** What the reading means, separate from the surface. */
export type MeterStatus = "neutral" | "success" | "warning" | "danger";

export interface MeterThreshold {
  /** The reading at which this status takes over, going up. */
  from: number;
  status: MeterStatus;
}

/** One table for every `meter-*` piece: the stroke and text color of each status. */
export const meterStatusStyles: Record<MeterStatus, { stroke: string; text: string }> = {
  neutral: { stroke: "stroke-foreground", text: "text-foreground" },
  success: { stroke: "stroke-emerald-500", text: "text-emerald-600 dark:text-emerald-400" },
  warning: { stroke: "stroke-amber-500", text: "text-amber-600 dark:text-amber-400" },
  danger: { stroke: "stroke-destructive", text: "text-destructive" },
};

/** The status for a reading: the last threshold it has reached. */
export function statusFor(value: number, thresholds: MeterThreshold[]): MeterStatus {
  let status: MeterStatus = "neutral";
  for (const threshold of [...thresholds].sort((a, b) => a.from - b.from)) if (value >= threshold.from) status = threshold.status;
  return status;
}

/** An ease-out without overshoot: a spring past the end would open a gap at the start of a full ring. */
const FILL_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

const trackStyles: Record<Tone, string> = {
  muted: "stroke-muted",
  outline: "stroke-border",
  ghost: "stroke-transparent",
};

const sizeStyles: Record<Size, { box: string; value: string; unit: string; stroke: number }> = {
  sm: { box: "size-20", value: "text-base", unit: "text-sm", stroke: 9 },
  default: { box: "size-28", value: "text-2xl", unit: "text-sm", stroke: 8 },
  lg: { box: "size-40", value: "text-4xl", unit: "text-base", stroke: 7 },
};

interface MeterRingProps {
  /** The reading. Ignored while `indeterminate`. */
  value?: number;
  min?: number;
  max?: number;
  /** What is measured, under the ring and in the accessible name. */
  label?: string;
  /** Unit written after the value in the middle, e.g. "GB". */
  unit?: string;
  /** Writes the value in the middle. Defaults to a rounded number. */
  formatValue?: (value: number) => string;
  /** Statuses by reading; the last one reached colors the ring. */
  thresholds?: MeterThreshold[];
  /** Splits the ring into this many segments. 0 keeps it whole. */
  segments?: number;
  /** Space between segments, as a percent of the ring. */
  gap?: number;
  /** An unknown amount of work: an arc turns round the track. */
  indeterminate?: boolean;
  /** Replaces the value in the middle. */
  children?: React.ReactNode;
  size?: Size;
  tone?: Tone;
  className?: string;
}

export const meterRingDemo: MeterRingProps = {
  value: 84,
  max: 100,
  label: "Storage used",
  unit: "GB",
  segments: 0,
  gap: 2,
};

// No thresholds by default: the ring stays in the foreground color unless you ask for statuses
const DEFAULT_THRESHOLDS: MeterThreshold[] = [];

export function MeterRing({
  value = 0,
  min = 0,
  max = 100,
  label,
  unit,
  formatValue = (reading) => Math.round(reading).toLocaleString("en-US"),
  thresholds = DEFAULT_THRESHOLDS,
  segments = 0,
  gap = 2,
  indeterminate = false,
  children,
  size = "default",
  tone = "muted",
  className,
}: MeterRingProps) {
  // Fills from empty on mount, so the first paint and the server agree
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const clamped = Math.min(max, Math.max(min, value));

  // The number counts along with the fill: same 900ms, same ease-out, written straight to the DOM
  const numberRef = React.useRef<HTMLSpanElement>(null);
  const displayed = React.useRef(min);
  const format = React.useRef(formatValue);
  format.current = formatValue;
  React.useEffect(() => {
    const el = numberRef.current;
    if (!mounted || indeterminate || !el) return;
    const from = displayed.current;
    const to = clamped;
    if (from === to || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      displayed.current = to;
      el.textContent = format.current(to);
      return;
    }
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const k = Math.min(1, (now - start) / 900);
      const reading = from + (to - from) * (1 - (1 - k) ** 5);
      displayed.current = reading;
      el.textContent = format.current(reading);
      if (k < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [mounted, clamped, indeterminate]);

  const fraction = max > min ? (clamped - min) / (max - min) : 0;
  const shown = mounted ? fraction : 0;
  const status = statusFor(clamped, thresholds);
  const { stroke } = sizeStyles[size];
  const radius = 50 - stroke / 2;
  // Round caps reach half a stroke past each end; in pathLength units that is this much
  const cap = (stroke / 2 / (2 * Math.PI * radius)) * 100;
  const count = Math.max(0, Math.round(segments));
  const written = `${formatValue(clamped)}${unit ? ` ${unit}` : ""}`;

  const ring = (props: React.SVGProps<SVGCircleElement>) => (
    <circle cx={50} cy={50} r={radius} fill="none" strokeWidth={stroke} strokeLinecap="round" pathLength={100} {...props} />
  );

  let arcs: React.ReactNode;
  if (indeterminate) {
    arcs = (
      <g className="origin-center motion-safe:animate-spin [animation-duration:1.4s]">
        {ring({ className: meterStatusStyles.neutral.stroke, strokeDasharray: "22 100" })}
      </g>
    );
  } else if (count > 1) {
    // Each segment is its own arc: a track, and a fill that grows within it
    const share = 100 / count;
    const length = Math.max(0.01, share - gap - cap * 2);
    arcs = Array.from({ length: count }, (_, index) => {
      const start = index * share + gap / 2 + cap;
      const filled = Math.min(length, Math.max(0, shown * 100 - index * share));
      return (
        <g key={index}>
          {ring({ className: trackStyles[tone], strokeDasharray: `${length} ${100 - length}`, strokeDashoffset: -start })}
          {ring({
            className: cn(meterStatusStyles[status].stroke, "motion-safe:transition-[stroke-dasharray,opacity] motion-safe:duration-700"),
            // In style, not attributes, so the change is a CSS transition
            style: {
              strokeDasharray: `${filled} ${100 - filled}`,
              strokeDashoffset: -start,
              opacity: filled > 0 ? 1 : 0,
              transitionTimingFunction: FILL_EASE,
              transitionDelay: `${index * 35}ms`,
            },
          })}
        </g>
      );
    });
  } else {
    arcs = (
      <>
        {ring({ className: trackStyles[tone] })}
        {ring({
          className: cn(meterStatusStyles[status].stroke, "motion-safe:transition-[stroke-dashoffset,opacity,stroke] motion-safe:duration-[900ms]"),
          strokeDasharray: "100 200",
          style: { strokeDashoffset: 100 - shown * 100, opacity: shown > 0 ? 1 : 0, transitionTimingFunction: FILL_EASE },
        })}
      </>
    );
  }

  return (
    <div data-slot="meter-ring" data-status={status} data-indeterminate={indeterminate || undefined} className={cn("inline-flex flex-col items-center gap-2 text-foreground", className)}>
      <div
        role={indeterminate ? "progressbar" : "meter"}
        aria-label={label}
        aria-valuemin={indeterminate ? undefined : min}
        aria-valuemax={indeterminate ? undefined : max}
        aria-valuenow={indeterminate ? undefined : clamped}
        aria-valuetext={indeterminate ? undefined : written}
        aria-busy={indeterminate || undefined}
        className={cn("relative grid place-items-center", sizeStyles[size].box)}
      >
        <svg viewBox="0 0 100 100" aria-hidden="true" className="absolute inset-0 size-full -rotate-90 overflow-visible">
          {arcs}
        </svg>
        <div aria-hidden="true" className="relative flex select-none flex-col items-center leading-none">
          {children ?? (
            !indeterminate && (
              <span className={cn("font-semibold tabular-nums tracking-tight", sizeStyles[size].value, meterStatusStyles[status].text)}>
                <span ref={numberRef}>{formatValue(min)}</span>
                {unit && <span className={cn("ml-0.5 font-normal text-muted-foreground", sizeStyles[size].unit)}>{unit}</span>}
              </span>
            )
          )}
        </div>
      </div>
      {label && <span className="select-none text-sm text-muted-foreground">{label}</span>}
    </div>
  );
}

"use client";

import type { LucideIcon } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

/** Surface treatment of the row. Mirrors inspector-slider. */
type Tone = "muted" | "outline" | "ghost";

/** Row height preset. Mirrors inspector-slider. */
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

/**
 * What the reading means. Separate from `tone`, which is the surface: a row can be
 * bare and still be reporting a failure, and one colour cannot say both.
 */
type Status = "neutral" | "success" | "warning" | "danger";

const statusFill: Record<Status, string> = {
  neutral: "bg-foreground/70",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-destructive",
};

const statusText: Record<Status, string> = {
  neutral: "text-foreground",
  success: "text-emerald-600 dark:text-emerald-400",
  warning: "text-amber-600 dark:text-amber-400",
  danger: "text-destructive",
};

interface Threshold {
  /** The reading at which this status takes over, going up. */
  from: number;
  status: Status;
}

interface InspectorMeterProps {
  /** Label rendered on the left, inside the row. */
  label: string;
  /** Optional leading icon shown before the label. */
  icon?: LucideIcon;

  /** The reading. */
  value: number;
  /**
   * The range it sits in, which is what the bar is a fraction of.
   * @defaultValue 0 to 100 */
  min?: number;
  max?: number;

  /**
   * How the number reads. Given a function, it decides outright; otherwise the
   * value is printed with `precision` decimals and `suffix` after it.
   */
  format?: (value: number) => string;
  /** Printed after the number, e.g. `%`, `kB`, `:1`. */
  suffix?: string;
  /**
   * Decimals the printed number keeps.
   * @defaultValue 0 */
  precision?: number;

  /**
   * What the reading means. Left out, `thresholds` decides; with neither, the row
   * is neutral.
   */
  status?: Status;
  /**
   * Bands, lowest first. The last one whose `from` the value has reached wins, so
   * a contrast ratio reads danger under 3, warning under 4.5 and success above it
   * without the caller computing that on every render.
   */
  thresholds?: Threshold[];

  /**
   * Show the bar. A reading with no meaningful range — a file count, a word count
   * — is better off as a number alone.
   * @defaultValue true */
  showBar?: boolean;

  /** Dim the row, for a reading that is not current. */
  disabled?: boolean;
  /**
   * Surface treatment: filled (default), hairline outline, or bare.
   * @defaultValue "muted" */
  tone?: Tone;
  /**
   * Row height preset.
   * @defaultValue "default" */
  size?: Size;

  className?: string;
  /** Accessible name. Falls back to `label`. */
  "aria-label"?: string;
}

export const inspectorMeterDemo: InspectorMeterProps = {
  label: "Contrast",
  className: "w-72",
  value: 5.3,
  min: 1,
  max: 21,
  precision: 2,
  suffix: ":1",
  thresholds: [
    { from: 1, status: "danger" },
    { from: 3, status: "warning" },
    { from: 4.5, status: "success" },
  ],
};

/**
 * The row that reports rather than asks. Everything else in the family owns a value
 * the reader sets; this one shows a value the work produced — a contrast ratio, a
 * bundle size, characters left, a score — in the same surface, so a measurement can
 * sit among the settings that caused it instead of in a paragraph underneath.
 *
 * It is a `meter`, not a `progressbar`: the difference is that a meter is a reading
 * within a known range and a progress bar is a task on its way to finishing, and
 * screen readers say the two differently.
 */
export function InspectorMeter({
  label,
  icon: Icon,
  value,
  min = 0,
  max = 100,
  format,
  suffix = "",
  precision = 0,
  status: statusProp,
  thresholds,
  showBar = true,
  disabled = false,
  tone = "muted",
  size = "default",
  className,
  "aria-label": ariaLabel,
}: InspectorMeterProps) {
  const status = React.useMemo<Status>(() => {
    if (statusProp) return statusProp;
    if (!thresholds || thresholds.length === 0) return "neutral";
    // Lowest first, last match wins: a band list reads the way a spec is written.
    return thresholds.reduce<Status>(
      (current, band) => (value >= band.from ? band.status : current),
      thresholds[0]?.status ?? "neutral",
    );
  }, [statusProp, thresholds, value]);

  const span = max - min;
  const fraction = span > 0 ? Math.min(1, Math.max(0, (value - min) / span)) : 0;

  const printed = format ? format(value) : `${value.toFixed(precision)}${suffix}`;

  return (
    <div
      role="meter"
      aria-label={ariaLabel ?? label}
      aria-valuenow={value}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuetext={printed}
      data-slot="inspector-meter"
      data-status={status}
      data-disabled={disabled}
      className={cn(
        "group/inspector-meter flex items-center gap-3",
        "h-(--inspector-height) rounded-(--inspector-radius) px-(--inspector-pad)",
        "[--inspector-radius:var(--radius-xl)]",
        "data-[disabled=true]:opacity-50",
        sizeStyles[size],
        toneStyles[tone],
        className,
      )}
    >
      <span
        data-slot="inspector-meter-label"
        className="flex min-w-0 shrink-0 items-center gap-1.5 text-sm font-medium text-foreground/70 select-none"
      >
        {Icon ? <Icon className="size-4 shrink-0" /> : null}
        <span className="truncate">{label}</span>
      </span>

      {showBar ? (
        <span
          aria-hidden="true"
          data-slot="inspector-meter-track"
          className="h-1.5 min-w-6 flex-1 overflow-hidden rounded-full bg-foreground/10"
        >
          <span
            data-slot="inspector-meter-fill"
            className={cn("block h-full rounded-full", statusFill[status])}
            style={{ width: `${fraction * 100}%` }}
          />
        </span>
      ) : null}

      <span
        data-slot="inspector-meter-value"
        className={cn(
          "ml-auto shrink-0 font-mono text-sm font-medium tabular-nums select-none",
          statusText[status],
        )}
      >
        {printed}
      </span>
    </div>
  );
}

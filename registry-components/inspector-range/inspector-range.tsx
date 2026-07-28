"use client";

import type { LucideIcon } from "lucide-react";
import * as React from "react";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

/** Surface treatment of the row. Mirrors inspector-slider. */
type Tone = "muted" | "outline" | "ghost";

/** Row height preset. Mirrors inspector-slider. */
type Size = "sm" | "default" | "lg";

/**
 * Entry for entry with inspector-slider's table: the band deepens on the muted
 * and outline tones, and the ghost tone reveals its border instead. "Engaged"
 * means hovered or holding keyboard focus, which is what that component's
 * `data-active` stands for.
 */
const toneStyles: Record<Tone, { surface: string; band: string }> = {
  muted: {
    surface: "bg-muted",
    band: cn(
      "[&_[data-slot=slider-range]]:bg-muted-foreground/10",
      "group-hover/inspector-range:[&_[data-slot=slider-range]]:bg-muted-foreground/20 group-has-[[data-slot=slider-thumb]:focus-visible]/inspector-range:[&_[data-slot=slider-range]]:bg-muted-foreground/20",
    ),
  },
  outline: {
    surface: "border border-border",
    band: cn(
      "[&_[data-slot=slider-range]]:bg-muted",
      "group-hover/inspector-range:[&_[data-slot=slider-range]]:bg-muted-foreground/15 group-has-[[data-slot=slider-thumb]:focus-visible]/inspector-range:[&_[data-slot=slider-range]]:bg-muted-foreground/15",
    ),
  },
  ghost: {
    surface: cn("border border-transparent", "group-hover/inspector-range:border-border group-has-[[data-slot=slider-thumb]:focus-visible]/inspector-range:border-border"),
    band: "[&_[data-slot=slider-range]]:bg-muted",
  },
};

const sizeStyles: Record<Size, string> = {
  sm: "[--inspector-height:--spacing(8)] [--inspector-pad:--spacing(2.5)]",
  default: "[--inspector-height:--spacing(9)] [--inspector-pad:--spacing(3)]",
  lg: "[--inspector-height:--spacing(11)] [--inspector-pad:--spacing(4)]",
};

/**
 * The row *is* the track, so the slider's own parts are stripped back to nothing
 * and the pill takes over: full height, no rounding of its own, and thumbs shaped
 * like inspector-slider's handle rather than the default circles.
 */
const SLIDER_AS_TRACK = cn(
  "absolute inset-0 h-full w-full cursor-pointer",
  "[&_[data-slot=slider-track]]:h-full [&_[data-slot=slider-track]]:rounded-(--inspector-radius) [&_[data-slot=slider-track]]:bg-transparent",
  "[&_[data-slot=slider-range]]:h-full",
  "[&_[data-slot=slider-thumb]]:h-5 [&_[data-slot=slider-thumb]]:w-1 [&_[data-slot=slider-thumb]]:rounded-full",
  "[&_[data-slot=slider-thumb]]:border-0 [&_[data-slot=slider-thumb]]:bg-foreground",
  "[&_[data-slot=slider-thumb]]:cursor-ew-resize [&_[data-slot=slider-thumb]]:shadow-none",
  "[&_[data-slot=slider-thumb]]:transition-[opacity,transform] [&_[data-slot=slider-thumb]]:duration-200",
  // Away from the row the thumbs recede to a hairline, exactly as the single
  // slider's handle does; hovering or focusing brings them up, and pressing
  // takes them further. `active` sorts after `hover` in Tailwind's output, so
  // the pressed state wins without extra specificity.
  "[&_[data-slot=slider-thumb]]:scale-x-[0.25] [&_[data-slot=slider-thumb]]:opacity-0",
  "group-hover/inspector-range:[&_[data-slot=slider-thumb]]:scale-x-100 group-hover/inspector-range:[&_[data-slot=slider-thumb]]:opacity-50",
  "group-has-[[data-slot=slider-thumb]:focus-visible]/inspector-range:[&_[data-slot=slider-thumb]]:scale-x-100 group-has-[[data-slot=slider-thumb]:focus-visible]/inspector-range:[&_[data-slot=slider-thumb]]:opacity-50",
  "group-active/inspector-range:[&_[data-slot=slider-thumb]]:opacity-80",
);

/** Tick marks, hidden until the row is engaged — the single slider's treatment. */
const TICKS =
  "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover/inspector-range:opacity-100 group-has-[[data-slot=slider-thumb]:focus-visible]/inspector-range:opacity-100";

/** The readout brightens on the same cue. */
const VALUE_ENGAGED =
  "group-hover/inspector-range:text-foreground group-has-[[data-slot=slider-thumb]:focus-visible]/inspector-range:text-foreground";

function clamp(value: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, value));
}

/** Decimal places implied by `step`, so 0.05 reads as "0.55" and not "0.55000001". */
function stepDecimals(step: number) {
  if (!Number.isFinite(step) || step <= 0) return 0;
  const text = String(step);
  const exponent = /e-(\d+)$/.exec(text);
  if (exponent) {
    const mantissa = text.split("e")[0]?.split(".")[1]?.length ?? 0;
    return Number(exponent[1]) + mantissa;
  }
  const dot = text.indexOf(".");
  return dot === -1 ? 0 : text.length - dot - 1;
}

interface InspectorRangeProps {
  /** Label rendered on the left, inside the row. */
  label: string;
  /** Optional leading icon shown before the label. */
  icon?: LucideIcon;

  /** Controlled pair, low then high. Pair it with `onValueChange`. */
  value?: [number, number];
  /** Initial pair in uncontrolled mode. Falls back to the whole range. */
  defaultValue?: [number, number];
  /** Fires on every thumb move. */
  onValueChange?: (value: [number, number]) => void;
  /** Fires when a thumb is released. Use it for work too expensive per frame. */
  onValueCommit?: (value: [number, number]) => void;

  /**
   * Minimum value.
   * @defaultValue 0 */
  min?: number;
  /**
   * Maximum value.
   * @defaultValue 100 */
  max?: number;
  /**
   * Smallest increment. Also drives how many decimals the readout shows.
   * @defaultValue 1 */
  step?: number;
  /** Format each end of the readout. Defaults to the number plus `unit`. */
  formatValue?: (value: number) => string;
  /** Suffix on the default readout, e.g. "px", "%". */
  unit?: string;
  /** Text between the two numbers. */
  separator?: string;
  /**
   * Tick marks inside the row: `true` for automatic (one per step up to 12,
   * otherwise deciles), a count, an explicit list of values, or `false`. They
   * appear on hover, as they do on the single slider.
   * @defaultValue true */
  ticks?: boolean | number | number[];
  /**
   * Steps to keep between the thumbs, so they cannot cross or stack.
   * @defaultValue 1 */
  minStepsBetweenThumbs?: number;

  /** Block interaction and dim the row. */
  disabled?: boolean;
  /**
   * Surface treatment: filled (default), hairline outline, or bare.
   * @defaultValue "muted" */
  tone?: Tone;
  /**
   * Row height preset.
   * @defaultValue "default" */
  size?: Size;

  /** Name of the underlying inputs, so the row can take part in a form. */
  name?: string;
  className?: string;
  /** Accessible name. Falls back to `label`. */
  "aria-label"?: string;
}

export const inspectorRangeDemo: InspectorRangeProps = {
  label: "Price",
  className: "w-72",
  min: 0,
  max: 300,
  step: 5,
  defaultValue: [40, 220],
  unit: "$",
};

export function InspectorRange({
  label,
  icon: Icon,
  value: valueProp,
  defaultValue,
  onValueChange,
  onValueCommit,
  min = 0,
  max = 100,
  step = 1,
  formatValue,
  unit,
  separator = "–",
  ticks = true,
  minStepsBetweenThumbs = 1,
  disabled = false,
  tone = "muted",
  size = "default",
  name,
  className,
  "aria-label": ariaLabel,
}: InspectorRangeProps) {
  const decimals = React.useMemo(() => stepDecimals(step), [step]);
  const span = max - min || 1;

  const tickFractions = React.useMemo<number[]>(() => {
    if (ticks === false) return [];
    if (Array.isArray(ticks)) {
      return ticks
        .map((entry) => (entry - min) / span)
        .filter((fraction) => fraction > 0 && fraction < 1);
    }
    const stepsInRange = step > 0 ? Math.round(span / step) : 0;
    const count =
      typeof ticks === "number"
        ? Math.round(ticks)
        : stepsInRange > 1 && stepsInRange <= 12
          ? stepsInRange
          : 10;
    if (count < 2) return [];
    return Array.from({ length: count - 1 }, (_, index) => (index + 1) / count);
  }, [ticks, min, span, step]);

  const [internalValue, setInternalValue] = React.useState<[number, number]>(
    defaultValue ?? [min, max],
  );
  const pair = valueProp ?? internalValue;
  const low = clamp(pair[0], min, max);
  const high = clamp(pair[1], min, max);

  const format = (entry: number) =>
    formatValue ? formatValue(entry) : `${entry.toFixed(decimals)}${unit ?? ""}`;

  const handleChange = (next: number[]) => {
    const bounded: [number, number] = [next[0] ?? min, next[1] ?? max];
    if (valueProp === undefined) setInternalValue(bounded);
    onValueChange?.(bounded);
  };

  const toneStyle = toneStyles[tone];

  return (
    <div
      data-slot="inspector-range"
      data-disabled={disabled}
      className={cn(
        "group/inspector-range relative h-(--inspector-height) overflow-hidden active:cursor-ew-resize",
        "rounded-(--inspector-radius) [--inspector-radius:var(--radius-xl)]",
        "has-[[data-slot=slider-thumb]:focus-visible]:ring-2 has-[[data-slot=slider-thumb]:focus-visible]:ring-ring/50 has-[[data-slot=slider-thumb]:focus-visible]:ring-offset-2 has-[[data-slot=slider-thumb]:focus-visible]:ring-offset-background",
        "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
        sizeStyles[size],
        toneStyle.surface,
        className,
      )}
    >
      {tickFractions.length > 0 ? (
        // Ahead of the slider in the DOM, so the band lies over them and shows
        // them through — the order the single slider uses for fill and ticks.
        <div data-slot="inspector-range-ticks" aria-hidden="true" className={TICKS}>
          {tickFractions.map((fraction) => (
            <span
              key={fraction}
              className="absolute top-1/2 h-2 w-px -translate-x-1/2 -translate-y-1/2 rounded-full bg-muted-foreground/30"
              style={{ left: `${fraction * 100}%` }}
            />
          ))}
        </div>
      ) : null}

      <Slider
        value={[low, high]}
        onValueChange={handleChange}
        onValueCommit={(next) => onValueCommit?.([next[0] ?? min, next[1] ?? max])}
        min={min}
        max={max}
        step={step}
        minStepsBetweenThumbs={minStepsBetweenThumbs}
        disabled={disabled}
        name={name}
        aria-label={ariaLabel ?? label}
        className={cn(SLIDER_AS_TRACK, toneStyle.band)}
      />

      <span
        data-slot="inspector-range-label"
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-(--inspector-pad) flex max-w-[55%] -translate-y-1/2 items-center gap-1.5 text-sm font-medium text-foreground/70 select-none"
      >
        {Icon ? <Icon className="size-4 shrink-0" /> : null}
        <span className="truncate">{label}</span>
      </span>

      <span
        data-slot="inspector-range-value"
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute top-1/2 right-(--inspector-pad) -translate-y-1/2 select-none",
          "font-mono text-sm font-medium tabular-nums transition-colors",
          "text-foreground/70",
          VALUE_ENGAGED,
        )}
      >
        {`${format(low)} ${separator} ${format(high)}`}
      </span>
    </div>
  );
}

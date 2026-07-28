"use client";

import type { LucideIcon } from "lucide-react";
import * as React from "react";
import { InspectorSelect } from "@/components/beste/component/inspector-select";
import { InspectorSlider } from "@/components/beste/component/inspector-slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

/** Surface treatment of the row. Mirrors inspector-slider. */
type Tone = "muted" | "outline" | "ghost";

/** Row height preset. Mirrors inspector-slider. */
type Size = "sm" | "default" | "lg";

/** The row itself is the trigger, so it answers hover like any other in the family. */
const toneStyles: Record<Tone, string> = {
  muted: "border border-transparent bg-muted hover:bg-muted-foreground/15",
  outline: "border border-border hover:bg-muted",
  ghost: "border border-transparent hover:border-border hover:bg-muted",
};

const sizeStyles: Record<Size, string> = {
  sm: "[--inspector-height:--spacing(8)] [--inspector-pad:--spacing(2.5)]",
  default: "[--inspector-height:--spacing(9)] [--inspector-pad:--spacing(3)]",
  lg: "[--inspector-height:--spacing(11)] [--inspector-pad:--spacing(4)]",
};

/** Breathing room between one run of the preview and the next. */
const PREVIEW_REST_MS = 400;

interface EasingOption {
  /** The CSS timing function, which is what is stored. */
  value: string;
  /** How it reads. Falls back to `value`. */
  label?: string;
}

const DEFAULT_EASINGS: EasingOption[] = [
  { value: "linear", label: "Linear" },
  { value: "ease", label: "Ease" },
  { value: "ease-in", label: "Ease in" },
  { value: "ease-out", label: "Ease out" },
  { value: "ease-in-out", label: "Ease in out" },
  { value: "cubic-bezier(0.4, 0, 0.2, 1)", label: "Standard" },
  { value: "cubic-bezier(0.34, 1.56, 0.64, 1)", label: "Overshoot" },
];

interface TransitionValue {
  /** Milliseconds the change takes. */
  duration?: number;
  /** Milliseconds before it starts. */
  delay?: number;
  /** A CSS timing function. */
  easing?: string;
}

/**
 * The CSS shorthand the value stands for. Exported because a panel that sets a
 * transition has to write one, and the order of the two times in that shorthand
 * (duration first, delay last) is exactly the thing that gets written backwards.
 */
export function transitionToCss(value: TransitionValue, property = "all"): string {
  const duration = value.duration ?? 0;
  const delay = value.delay ?? 0;
  const easing = value.easing ?? "ease";
  return `${property} ${duration}ms ${easing}${delay ? ` ${delay}ms` : ""}`;
}

interface InspectorTransitionProps {
  /** Label rendered on the left, inside the row. */
  label: string;
  /** Optional leading icon shown before the label. */
  icon?: LucideIcon;

  /** Controlled value. Pair it with `onValueChange`. */
  value?: TransitionValue;
  /** Initial value in uncontrolled mode. */
  defaultValue?: TransitionValue;
  onValueChange?: (value: TransitionValue) => void;
  /** Fires when the editor opens or closes. */
  onOpenChange?: (open: boolean) => void;

  /**
   * The timing functions on offer. For drawing a curve by hand, reach for
   * inspector-easing — this row is for picking one and timing it.
   */
  easings?: (string | EasingOption)[];
  /**
   * Ceiling for both times, in milliseconds.
   * @defaultValue 2000 */
  maxDuration?: number;
  /**
   * Step for both times, in milliseconds.
   * @defaultValue 10 */
  step?: number;

  /** Block interaction and dim the row. */
  disabled?: boolean;
  /**
   * Surface treatment: filled (default), hairline outline, or bare until hover.
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

export const inspectorTransitionDemo: InspectorTransitionProps = {
  label: "Transition",
  className: "w-72",
  defaultValue: { duration: 300, delay: 0, easing: "cubic-bezier(0.4, 0, 0.2, 1)" },
};

/**
 * How long a change takes, when it starts, and the shape of it.
 *
 * The three always travel together and are never read apart, which is what makes
 * them one row rather than three: a panel with a Duration slider six rows above an
 * Easing select is a panel where nobody finds out the two disagree.
 *
 * The preview runs the real transition on a loop rather than drawing its curve —
 * inspector-easing already draws curves, and what a reader wants to know here is
 * whether 300ms feels slow, which no picture of a curve answers.
 */
export function InspectorTransition({
  label,
  icon: Icon,
  value: valueProp,
  defaultValue,
  onValueChange,
  onOpenChange,
  easings = DEFAULT_EASINGS,
  maxDuration = 2000,
  step = 10,
  disabled = false,
  tone = "muted",
  size = "default",
  className,
  "aria-label": ariaLabel,
}: InspectorTransitionProps) {
  const options = React.useMemo(
    () => easings.map((entry) => (typeof entry === "string" ? { value: entry } : entry)),
    [easings],
  );

  const [internalValue, setInternalValue] = React.useState<TransitionValue>(
    defaultValue ?? { duration: 200, delay: 0, easing: options[0]?.value ?? "ease" },
  );
  const value = valueProp ?? internalValue;
  const [open, setOpen] = React.useState(false);

  const duration = value.duration ?? 0;
  const delay = value.delay ?? 0;
  const easing = value.easing ?? options[0]?.value ?? "ease";

  const write = (patch: Partial<TransitionValue>) => {
    const next = { ...value, ...patch };
    if (valueProp === undefined) setInternalValue(next);
    onValueChange?.(next);
  };

  /*
   * The preview only runs while the editor is open. A dot that travels forever in a
   * closed popover is work nobody is watching, and one that travels in the row
   * itself is a panel that never sits still.
   */
  const [away, setAway] = React.useState(false);
  React.useEffect(() => {
    if (!open) {
      setAway(false);
      return;
    }
    const period = Math.max(duration + delay + PREVIEW_REST_MS, 200);
    const timer = window.setInterval(() => setAway((current) => !current), period);
    return () => window.clearInterval(timer);
  }, [delay, duration, open]);

  const easingLabel = options.find((option) => option.value === easing)?.label ?? easing;
  const summary = `${duration}ms${delay ? ` +${delay}` : ""} ${easingLabel}`;

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        onOpenChange?.(next);
      }}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          aria-label={ariaLabel}
          data-slot="inspector-transition"
          data-disabled={disabled}
          className={cn(
            "group/inspector-transition flex w-full cursor-pointer items-center gap-2 text-left",
            "h-(--inspector-height) rounded-(--inspector-radius) px-(--inspector-pad)",
            "[--inspector-radius:var(--radius-xl)] transition-colors",
            "outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
            sizeStyles[size],
            toneStyles[tone],
            className,
          )}
        >
          <span
            data-slot="inspector-transition-label"
            className="flex min-w-0 shrink-0 items-center gap-1.5 text-sm font-medium text-foreground/70 select-none"
          >
            {Icon ? <Icon className="size-4 shrink-0" /> : null}
            <span className="truncate">{label}</span>
          </span>

          <span
            data-slot="inspector-transition-value"
            className="ml-auto min-w-0 truncate text-sm font-medium text-foreground select-none"
          >
            {summary}
          </span>
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        side="bottom"
        sideOffset={8}
        className="w-[var(--radix-popover-trigger-width)] min-w-64 p-3"
      >
        <div className="flex flex-col gap-2">
          {/*
            The transition itself, on a loop. `motion-safe` because a reader who has
            asked for less motion has asked for exactly this, and the numbers below
            still say what the setting is.
          */}
          <span
            aria-hidden="true"
            data-slot="inspector-transition-preview"
            className="flex h-8 items-center rounded-md bg-muted px-2"
          >
            <span className="relative h-1.5 w-full rounded-full bg-foreground/10">
              <span
                className="absolute top-1/2 size-3 -translate-y-1/2 rounded-full bg-foreground motion-safe:transition-[left]"
                style={{
                  // The dot's own width taken off the end, so it stops flush with
                  // the track rather than hanging off it.
                  left: away ? "calc(100% - 0.75rem)" : "0px",
                  transitionDuration: `${duration}ms`,
                  transitionDelay: `${delay}ms`,
                  transitionTimingFunction: easing,
                }}
              />
            </span>
          </span>

          <InspectorSlider
            label="Duration"
            value={duration}
            onValueChange={(next) => write({ duration: next })}
            min={0}
            max={maxDuration}
            step={step}
            unit="ms"
            tone="ghost"
            size="sm"
          />

          <InspectorSlider
            label="Delay"
            value={delay}
            onValueChange={(next) => write({ delay: next })}
            min={0}
            max={maxDuration}
            step={step}
            unit="ms"
            tone="ghost"
            size="sm"
          />

          {/*
            A row of the family, like the two sliders above it. This was a hand-built
            label with a native menu on the right, which made the third setting in the
            editor the only one that did not look like a setting.
          */}
          <InspectorSelect
            label="Easing"
            size="sm"
            tone="ghost"
            options={options.map((option) => ({
              value: option.value,
              label: option.label ?? option.value,
            }))}
            value={easing}
            disabled={disabled}
            onValueChange={(next) => write({ easing: next })}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}

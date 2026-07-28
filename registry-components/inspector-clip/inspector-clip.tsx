"use client";

import type { LucideIcon } from "lucide-react";
import * as React from "react";
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

interface ClipShape {
  /** Reported on selection, and what a controlled value is matched against. */
  value: string;
  /** How it reads. Falls back to `value`. */
  label?: string;
  /**
   * The `clip-path` this shape comes to. A function for a shape with a number in
   * it, which is what brings the amount slider out.
   */
  css: string | ((amount: number) => string);
  /** Where the amount starts when this shape is chosen. */
  defaultAmount?: number;
  /** What the amount is called, for the slider's label. */
  amountLabel?: string;
}

/*
 * Percentages throughout, never pixels: a clip path in pixels is a shape that only
 * fits the box it was drawn against, and these are meant to survive a box that
 * changes size.
 */
const DEFAULT_SHAPES: ClipShape[] = [
  { value: "none", label: "None", css: "none" },
  {
    value: "circle",
    label: "Circle",
    css: (amount) => `circle(${amount}% at 50% 50%)`,
    defaultAmount: 50,
    amountLabel: "Radius",
  },
  {
    value: "ellipse",
    label: "Ellipse",
    css: (amount) => `ellipse(${amount}% ${Math.round(amount * 0.75)}% at 50% 50%)`,
    defaultAmount: 50,
    amountLabel: "Radius",
  },
  {
    value: "inset",
    label: "Inset",
    css: (amount) => `inset(${amount}%)`,
    defaultAmount: 10,
    amountLabel: "Inset",
  },
  { value: "triangle", label: "Triangle", css: "polygon(50% 0%, 100% 100%, 0% 100%)" },
  {
    value: "diamond",
    label: "Diamond",
    css: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
  },
  {
    value: "hexagon",
    label: "Hexagon",
    css: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
  },
  {
    value: "chevron",
    label: "Chevron",
    css: "polygon(75% 0%, 100% 50%, 75% 100%, 0% 100%, 25% 50%, 0% 0%)",
  },
  {
    value: "slant",
    label: "Slant",
    css: "polygon(0% 0%, 100% 0%, 100% 85%, 0% 100%)",
  },
  {
    value: "message",
    label: "Message",
    css: "polygon(0% 0%, 100% 0%, 100% 75%, 60% 75%, 45% 100%, 40% 75%, 0% 75%)",
  },
];

interface ClipValue {
  /** Which shape, by its `value`. */
  shape?: string;
  /** The number a parametric shape takes, as a percentage. */
  amount?: number;
}

/**
 * The `clip-path` the value stands for. Exported because the value is a name and a
 * number until something turns it into CSS, and a consumer should not have to keep
 * a copy of the shape table to do it.
 */
export function clipToCss(value: ClipValue, shapes: ClipShape[] = DEFAULT_SHAPES): string {
  const shape = shapes.find((entry) => entry.value === (value.shape ?? "none"));
  if (!shape) return "none";
  return typeof shape.css === "function"
    ? shape.css(value.amount ?? shape.defaultAmount ?? 50)
    : shape.css;
}

interface InspectorClipProps {
  /** Label rendered on the left, inside the row. */
  label: string;
  /** Optional leading icon shown before the label. */
  icon?: LucideIcon;

  /** Controlled value. Pair it with `onValueChange`. */
  value?: ClipValue;
  /** Initial value in uncontrolled mode. */
  defaultValue?: ClipValue;
  onValueChange?: (value: ClipValue) => void;
  /** Fires when the editor opens or closes. */
  onOpenChange?: (open: boolean) => void;

  /**
   * The shapes on offer. Each carries the CSS it comes to, as a string or as a
   * function of one number — and a function is what brings out the amount slider.
   */
  shapes?: ClipShape[];
  /**
   * Shapes per row in the grid.
   * @defaultValue 5 */
  columns?: number;

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

export const inspectorClipDemo: InspectorClipProps = {
  label: "Shape",
  className: "w-72",
  defaultValue: { shape: "hexagon" },
};

/**
 * The shape a box is cut to.
 *
 * Every option is drawn with the property it sets — each thumbnail is a filled
 * square with that exact `clip-path` on it — so the grid is not a picture of the
 * shapes, it *is* the shapes. That is the only honest way to show a value whose
 * whole content is what it looks like, and it costs nothing: the browser is
 * already the thing that knows how to draw them.
 */
export function InspectorClip({
  label,
  icon: Icon,
  value: valueProp,
  defaultValue,
  onValueChange,
  onOpenChange,
  shapes = DEFAULT_SHAPES,
  columns = 5,
  disabled = false,
  tone = "muted",
  size = "default",
  className,
  "aria-label": ariaLabel,
}: InspectorClipProps) {
  const [internalValue, setInternalValue] = React.useState<ClipValue>(
    defaultValue ?? { shape: shapes[0]?.value ?? "none" },
  );
  const value = valueProp ?? internalValue;
  const [open, setOpen] = React.useState(false);

  const active = shapes.find((entry) => entry.value === (value.shape ?? "none"));
  const parametric = typeof active?.css === "function";
  const amount = value.amount ?? active?.defaultAmount ?? 50;

  const write = (patch: Partial<ClipValue>) => {
    const next = { ...value, ...patch };
    if (valueProp === undefined) setInternalValue(next);
    onValueChange?.(next);
  };

  const pick = (shape: ClipShape) => {
    // A shape brings its own starting number with it: an inset that opened at the
    // circle's 50 would swallow the box, and asking the reader to fix that is
    // asking them to undo the choice they just made.
    write({
      shape: shape.value,
      amount: typeof shape.css === "function" ? (shape.defaultAmount ?? 50) : undefined,
    });
  };

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
          data-slot="inspector-clip"
          data-disabled={disabled}
          className={cn(
            "group/inspector-clip flex w-full cursor-pointer items-center gap-2 text-left",
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
            data-slot="inspector-clip-label"
            className="flex min-w-0 items-center gap-1.5 text-sm font-medium text-foreground/70 select-none"
          >
            {Icon ? <Icon className="size-4 shrink-0" /> : null}
            <span className="truncate">{label}</span>
          </span>

          <span
            data-slot="inspector-clip-value"
            className="ml-auto min-w-0 truncate text-sm font-medium text-foreground select-none"
          >
            {active ? (active.label ?? active.value) : ""}
            {parametric ? ` ${amount}%` : ""}
          </span>

          {/* The shape itself, cut out of a filled square, exactly as the grid
              draws it. No border: the glyph has an outline of its own now. */}
          <span
            aria-hidden="true"
            data-slot="inspector-clip-glyph"
            className="size-4 shrink-0 bg-foreground/70"
            style={{ clipPath: clipToCss(value, shapes) }}
          />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        side="bottom"
        sideOffset={8}
        className="w-[var(--radix-popover-trigger-width)] min-w-64 p-2"
      >
        <div className="flex flex-col gap-2">
          {/* biome-ignore lint/a11y/useSemanticElements: a fieldset wants a legend, and the name for this set is the row that opened it */}
          <div
            role="group"
            aria-label={ariaLabel ?? label}
            className="grid gap-1"
            style={{ gridTemplateColumns: `repeat(${Math.max(columns, 1)}, minmax(0, 1fr))` }}
          >
            {shapes.map((shape) => {
              const isActive = shape.value === (value.shape ?? "none");
              const preview =
                typeof shape.css === "function"
                  ? shape.css(shape.defaultAmount ?? 50)
                  : shape.css;

              return (
                <button
                  key={shape.value}
                  type="button"
                  onClick={() => pick(shape)}
                  aria-pressed={isActive}
                  title={shape.label ?? shape.value}
                  aria-label={shape.label ?? shape.value}
                  className={cn(
                    "flex aspect-square w-full cursor-pointer items-center justify-center rounded-md border p-1.5",
                    "transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                    isActive
                      ? "border-foreground/20 bg-foreground/10"
                      : "border-border hover:bg-accent",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "size-full",
                      // "None" is the one entry with nothing to draw, so it is
                      // drawn as an empty frame rather than as a full square that
                      // would read as a shape of its own.
                      preview === "none"
                        ? "rounded-sm border border-dashed border-foreground/30"
                        : isActive
                          ? "bg-foreground"
                          : "bg-foreground/60",
                    )}
                    style={preview === "none" ? undefined : { clipPath: preview }}
                  />
                </button>
              );
            })}
          </div>

          {parametric ? (
            <InspectorSlider
              label={active?.amountLabel ?? "Amount"}
              value={amount}
              onValueChange={(next) => write({ amount: next })}
              min={0}
              max={100}
              step={1}
              unit="%"
              tone="ghost"
              size="sm"
            />
          ) : null}
        </div>
      </PopoverContent>
    </Popover>
  );
}

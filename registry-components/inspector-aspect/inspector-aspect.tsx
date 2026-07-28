"use client";

import type { LucideIcon } from "lucide-react";
import * as React from "react";
import { InspectorSelect } from "@/components/beste/component/inspector-select";
import { InspectorStepper } from "@/components/beste/component/inspector-stepper";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

/** Surface treatment of the row. Mirrors inspector-slider. */
type Tone = "muted" | "outline" | "ghost";

/** Row height preset. Mirrors inspector-slider. */
type Size = "sm" | "default" | "lg";

/** The row itself presses, so it answers hover like any other trigger in the family. */
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

/** A ratio, kept as the two numbers rather than as their quotient. */
interface AspectValue {
  /** Width part. */
  w?: number;
  /** Height part. */
  h?: number;
}

interface AspectPreset {
  w: number;
  h: number;
  /** How it reads. Falls back to `w:h`. */
  label?: string;
}

/**
 * The ratios worth a name. Kept as pairs, not decimals: 16:9 is what a reader
 * recognises and 1.7778 is what it becomes once the two numbers are lost.
 */
const PRESETS: AspectPreset[] = [
  { w: 1, h: 1, label: "Square" },
  { w: 4, h: 3 },
  { w: 3, h: 2 },
  { w: 16, h: 9 },
  { w: 21, h: 9 },
  { w: 9, h: 16, label: "Portrait" },
];

const DEFAULT_ASPECT: Required<AspectValue> = { w: 16, h: 9 };

/** The square the row's glyph is fitted into, in px. */
const GLYPH_BOX = { w: 20, h: 20 };
/** The area the editor's shape is fitted into, in px. */
const SHAPE_BOX = { w: 200, h: 80 };

/**
 * The largest w-by-h shape that fits inside a box, in px.
 *
 * Both sides are worked out here rather than handed to `aspect-ratio`, because that
 * property derives one side from the other: give it a width and the height it
 * computes has no idea a container is only 96px tall, which is how a 9:16 shape ends
 * up drawn straight through the panel it is supposed to sit in. Scaling by whichever
 * axis runs out first is the whole of "contain", and it cannot overflow.
 */
function fit(w: number, h: number, box: { w: number; h: number }) {
  const scale = Math.min(box.w / w, box.h / h);
  return { width: w * scale, height: h * scale };
}

function resolve(value: AspectValue | undefined) {
  const w = value?.w && value.w > 0 ? value.w : DEFAULT_ASPECT.w;
  const h = value?.h && value.h > 0 ? value.h : DEFAULT_ASPECT.h;
  return { w, h };
}

/** Divide both sides by their common factor, so 1920:1080 reads as 16:9. */
function simplify({ w, h }: { w: number; h: number }) {
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const factor = gcd(Math.round(w), Math.round(h)) || 1;
  return { w: Math.round(w) / factor, h: Math.round(h) / factor };
}

interface InspectorAspectProps {
  /** Label rendered on the left, inside the row. */
  label: string;
  /** Optional leading icon shown before the label. */
  icon?: LucideIcon;

  /** Controlled value. Pair it with `onValueChange`. */
  value?: AspectValue;
  /** Initial value in uncontrolled mode. */
  defaultValue?: AspectValue;
  /** Fires on every adjustment. */
  onValueChange?: (value: AspectValue) => void;
  /**
   * Fires once an adjustment is finished — a preset chosen, a side committed. Use
   * it for work too expensive to run per keystroke.
   */
  onValueCommit?: (value: AspectValue) => void;
  /** Fires when the editor opens or closes. */
  onOpenChange?: (open: boolean) => void;

  /**
   * Which ratios to offer by name. The two sides stay editable regardless, so this
   * is a set of shortcuts rather than a set of allowed answers.
   * @defaultValue the six ratios anyone can name */
  presets?: AspectPreset[];
  /**
   * Largest either side may be.
   * @defaultValue 100 */
  maxSide?: number;

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

export const inspectorAspectDemo: InspectorAspectProps = {
  label: "Aspect Ratio",
  className: "w-72",
  defaultValue: { w: 16, h: 9 },
};

export function InspectorAspect({
  label,
  icon: Icon,
  value: valueProp,
  defaultValue,
  onValueChange,
  onValueCommit,
  onOpenChange,
  presets = PRESETS,
  maxSide = 100,
  disabled = false,
  tone = "muted",
  size = "default",
  className,
  "aria-label": ariaLabel,
}: InspectorAspectProps) {
  const [internalValue, setInternalValue] = React.useState<AspectValue>(defaultValue ?? {});
  const value = valueProp ?? internalValue;
  const { w, h } = resolve(value);

  const valueRef = React.useRef(value);
  valueRef.current = value;

  const write = (patch: Partial<AspectValue>, complete: boolean) => {
    const next = { ...valueRef.current, ...patch };
    valueRef.current = next;
    if (valueProp === undefined) setInternalValue(next);
    onValueChange?.(next);
    if (complete) onValueCommit?.(next);
  };

  const key = (ratio: { w: number; h: number }) => {
    const reduced = simplify(ratio);
    return `${reduced.w}:${reduced.h}`;
  };

  const current = key({ w, h });
  const options = React.useMemo(
    () =>
      presets.map((preset) => ({
        value: key(preset),
        label: preset.label ? `${preset.label} · ${preset.w}:${preset.h}` : `${preset.w}:${preset.h}`,
      })),
    [presets],
  );
  /* Sitting on nothing when the ratio is not a named one, so the menu's placeholder
     says "Custom" rather than the menu claiming a preset the value is not. */
  const selected = options.some((option) => option.value === current) ? current : "";

  /* Both drawings are the same fit at two sizes, so neither can disagree with the
     other about what the ratio looks like. */
  const glyph = fit(w, h, GLYPH_BOX);
  const shape = fit(w, h, SHAPE_BOX);

  return (
    <Popover onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          aria-label={ariaLabel}
          data-slot="inspector-aspect"
          data-disabled={disabled}
          className={cn(
            "group/inspector-aspect flex w-full cursor-pointer items-center gap-2 text-left",
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
            data-slot="inspector-aspect-label"
            className="flex min-w-0 items-center gap-1.5 text-sm font-medium text-foreground/70 select-none"
          >
            {Icon ? <Icon className="size-4 shrink-0" /> : null}
            <span className="truncate">{label}</span>
          </span>

          <span className="ml-auto flex min-w-0 items-center gap-2">
            <span
              data-slot="inspector-aspect-value"
              className="truncate font-mono text-sm font-medium tabular-nums text-foreground select-none"
            >
              {current}
            </span>
            {/* The ratio, drawn. It is the one thing about a ratio that reads
                instantly, and the numbers beside it are the precise version. */}
            <span
              aria-hidden="true"
              className="flex size-5 shrink-0 items-center justify-center"
            >
              <span
                data-slot="inspector-aspect-preview"
                className="rounded-sm border border-current text-foreground/70"
                style={glyph}
              />
            </span>
          </span>
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        side="bottom"
        sideOffset={8}
        className="w-[var(--radix-popover-trigger-width)] min-w-64 p-2"
      >
        {/*
          The shape at a size worth looking at, on a ground like the other pads. Its
          height is fixed at the box it is fitted into, so the panel does not change
          height every time the ratio does.
        */}
        <div
          className="mb-2 flex items-center justify-center rounded-lg bg-muted"
          style={{ height: SHAPE_BOX.h + 24 }}
        >
          <span
            aria-hidden="true"
            data-slot="inspector-aspect-shape"
            className="rounded-md border-2 border-dashed border-muted-foreground/40"
            style={shape}
          />
        </div>

        <div className="flex flex-col gap-1">
          <InspectorSelect
            label="Ratio"
            size="sm"
            placeholder="Custom"
            options={options}
            value={selected}
            onValueChange={(next) => {
              const [nextW, nextH] = next.split(":").map(Number);
              if (nextW && nextH) write({ w: nextW, h: nextH }, true);
            }}
          />

          {/* The two sides, always editable: a ratio nobody named is still a ratio. */}
          <InspectorStepper
            label="Width"
            size="sm"
            min={1}
            max={maxSide}
            step={1}
            value={w}
            onValueChange={(next) => write({ w: next }, false)}
            onValueCommit={(next) => write({ w: next }, true)}
          />
          <InspectorStepper
            label="Height"
            size="sm"
            min={1}
            max={maxSide}
            step={1}
            value={h}
            onValueChange={(next) => write({ h: next }, false)}
            onValueCommit={(next) => write({ h: next }, true)}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}

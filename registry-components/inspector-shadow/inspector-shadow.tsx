"use client";

import type { LucideIcon } from "lucide-react";
import * as React from "react";
import { InspectorColor } from "@/components/beste/component/inspector-color";
import { InspectorSlider } from "@/components/beste/component/inspector-slider";
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

/**
 * A shadow, in the pieces CSS takes it in. Opacity is not among them on purpose:
 * `color` carries its own alpha, so a separate control would be a second way to
 * say the same thing — and two ways to set one number always drift.
 */
interface ShadowValue {
  /** Horizontal offset in px. */
  x?: number;
  /** Vertical offset in px. */
  y?: number;
  /** Blur radius in px. */
  blur?: number;
  /** Spread radius in px. */
  spread?: number;
  /** Any CSS colour, alpha included. */
  color?: string;
  /** Draw the shadow inside the box rather than outside it. */
  inset?: boolean;
}

const DEFAULT_SHADOW: Required<Omit<ShadowValue, "inset">> & { inset: boolean } = {
  x: 0,
  y: 2,
  blur: 8,
  spread: 0,
  color: "#00000026",
  inset: false,
};

function resolve(value: ShadowValue | undefined) {
  return { ...DEFAULT_SHADOW, ...value };
}

/** The `box-shadow` these pieces spell out. Exposed on the row as its preview. */
function toCss(value: ShadowValue | undefined): string {
  const { x, y, blur, spread, color, inset } = resolve(value);
  return `${inset ? "inset " : ""}${x}px ${y}px ${blur}px ${spread}px ${color}`;
}

interface InspectorShadowProps {
  /** Label rendered on the left, inside the row. */
  label: string;
  /** Optional leading icon shown before the label. */
  icon?: LucideIcon;

  /** Controlled value. Pair it with `onValueChange`. */
  value?: ShadowValue;
  /** Initial value in uncontrolled mode. */
  defaultValue?: ShadowValue;
  /** Fires on every adjustment, including each frame of a drag. */
  onValueChange?: (value: ShadowValue) => void;
  /**
   * Fires once an adjustment is finished — a slider released, a colour committed.
   * Use it for work too expensive to run per frame.
   */
  onValueCommit?: (value: ShadowValue) => void;
  /** Fires when the editor opens or closes. */
  onOpenChange?: (open: boolean) => void;

  /**
   * Largest offset either axis may take, in px. The range runs both ways.
   * @defaultValue 40 */
  maxOffset?: number;
  /**
   * Largest blur, in px.
   * @defaultValue 80 */
  maxBlur?: number;
  /**
   * Largest spread, in px. The range runs both ways.
   * @defaultValue 20 */
  maxSpread?: number;
  /** Offer the inset toggle. */
  allowInset?: boolean;
  /** Notation the colour is written back in. */
  format?: "hex" | "oklch" | "rgb";

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

export const inspectorShadowDemo: InspectorShadowProps = {
  label: "Shadow",
  className: "w-72",
  defaultValue: { x: 0, y: 3, blur: 12, spread: -2, color: "#0f172a33" },
};

export function InspectorShadow({
  label,
  icon: Icon,
  value: valueProp,
  defaultValue,
  onValueChange,
  onValueCommit,
  onOpenChange,
  maxOffset = 40,
  maxBlur = 80,
  maxSpread = 20,
  allowInset = false,
  format = "hex",
  disabled = false,
  tone = "muted",
  size = "default",
  className,
  "aria-label": ariaLabel,
}: InspectorShadowProps) {
  const [internalValue, setInternalValue] = React.useState<ShadowValue>(defaultValue ?? {});
  const value = valueProp ?? internalValue;
  const shadow = resolve(value);

  const valueRef = React.useRef(value);
  valueRef.current = value;

  const write = (patch: Partial<ShadowValue>, complete: boolean) => {
    const next = { ...valueRef.current, ...patch };
    valueRef.current = next;
    if (valueProp === undefined) setInternalValue(next);
    onValueChange?.(next);
    if (complete) onValueCommit?.(next);
  };

  /** One row per piece of the shadow, so the editor is the family stacked up. */
  const slider = (
    key: "x" | "y" | "blur" | "spread",
    rowLabel: string,
    min: number,
    max: number,
  ) => (
    <InspectorSlider
      key={key}
      label={rowLabel}
      size="sm"
      min={min}
      max={max}
      step={1}
      ticks={false}
      value={shadow[key]}
      onValueChange={(next) => write({ [key]: next }, false)}
      onValueCommit={(next) => write({ [key]: next }, true)}
      formatValue={(next) => `${Math.round(next)}px`}
    />
  );

  return (
    <Popover onOpenChange={onOpenChange}>
      {/*
        The row is the trigger, so the editor can take the trigger width and open
        flush with it. What the row shows is the shadow itself: six numbers read as
        nothing, and a shadow is the one value that can simply be displayed.
      */}
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          aria-label={ariaLabel}
          data-slot="inspector-shadow"
          data-disabled={disabled}
          className={cn(
            "group/inspector-shadow flex w-full cursor-pointer items-center gap-2 text-left",
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
            data-slot="inspector-shadow-label"
            className="flex min-w-0 items-center gap-1.5 text-sm font-medium text-foreground/70 select-none"
          >
            {Icon ? <Icon className="size-4 shrink-0" /> : null}
            <span className="truncate">{label}</span>
          </span>

          <span className="ml-auto flex min-w-0 items-center gap-2">
            <span
              data-slot="inspector-shadow-summary"
              className="truncate font-mono text-sm font-medium tabular-nums text-foreground select-none"
            >
              {`${shadow.x} ${shadow.y} ${shadow.blur}`}
            </span>
            {/*
              The preview sits inside its own padding: a shadow drawn at the very
              edge of the row would be clipped exactly where it matters.
            */}
            <span
              aria-hidden="true"
              className="flex size-6 shrink-0 items-center justify-center"
            >
              <span
                data-slot="inspector-shadow-preview"
                className="size-4 rounded-sm border border-border bg-background"
                style={{ boxShadow: toCss(value) }}
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
          A wider preview at the top, because a shadow cannot be judged on a 16px
          square, and the pieces below it in the order CSS names them.
        */}
        <div className="mb-2 flex items-center justify-center rounded-md bg-background py-5">
          <span
            aria-hidden="true"
            className="size-12 rounded-md border border-border bg-card"
            style={{ boxShadow: toCss(value) }}
          />
        </div>

        <div className="flex flex-col gap-1">
          {slider("x", "Offset X", -maxOffset, maxOffset)}
          {slider("y", "Offset Y", -maxOffset, maxOffset)}
          {slider("blur", "Blur", 0, maxBlur)}
          {slider("spread", "Spread", -maxSpread, maxSpread)}

          {/*
            The colour is a row of the family too, alpha and all — which is what
            saves this editor from carrying an opacity control beside it.
          */}
          <InspectorColor
            label="Color"
            size="sm"
            alpha
            format={format}
            value={shadow.color}
            onValueChange={(next) => write({ color: next }, false)}
            onValueCommit={(next) => write({ color: next }, true)}
          />
        </div>

        {allowInset ? (
          <button
            type="button"
            onClick={() => write({ inset: !shadow.inset }, true)}
            aria-pressed={shadow.inset}
            data-slot="inspector-shadow-inset"
            className={cn(
              "mt-2 flex w-full cursor-pointer items-center justify-center gap-1.5",
              "border-t border-border pt-2 text-sm font-medium select-none",
              "transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
              shadow.inset ? "text-foreground" : "text-foreground/70 hover:text-foreground",
            )}
          >
            {shadow.inset ? "Inset" : "Outset"}
          </button>
        ) : null}
      </PopoverContent>
    </Popover>
  );
}

"use client";

import { type LucideIcon, MinusIcon, PlusIcon } from "lucide-react";
import * as React from "react";
import { ColorPicker } from "@/components/beste/component/color-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

/** Surface treatment of the row. Mirrors inspector-slider. */
type Tone = "muted" | "outline" | "ghost";

/** Row height preset. Mirrors inspector-slider. */
type Size = "sm" | "default" | "lg";

const toneStyles: Record<Tone, string> = {
  muted: "border border-transparent bg-muted",
  outline: "border border-border",
  ghost: "border border-transparent hover:border-border",
};

const sizeStyles: Record<Size, string> = {
  sm: "[--inspector-height:--spacing(8)] [--inspector-pad:--spacing(2.5)]",
  default: "[--inspector-height:--spacing(9)] [--inspector-pad:--spacing(3)]",
  lg: "[--inspector-height:--spacing(11)] [--inspector-pad:--spacing(4)]",
};

const COUNT_BUTTON =
  "flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-md text-foreground/70 transition-colors hover:bg-foreground/10 hover:text-foreground disabled:pointer-events-none disabled:opacity-40";

/** Checkerboard shown behind a translucent swatch. */
const ALPHA_CHECKER =
  "conic-gradient(from 90deg at 50% 50%, color-mix(in srgb, currentColor 20%, transparent) 25%, transparent 0 50%, color-mix(in srgb, currentColor 20%, transparent) 0 75%, transparent 0)";

/** Accepts hex, `rgb()`/`rgba()` and `oklch()`; anything else keeps a swatch empty. */
function isRenderableColor(value: string | undefined): boolean {
  if (!value) return false;
  const candidate = value.trim();
  return (
    /^#?[0-9a-f]{3,8}$/i.test(candidate) ||
    /^(rgba?|oklch|hsla?|oklab|lab|lch|color)\(/i.test(candidate)
  );
}

interface InspectorMulticolorProps {
  /** Label rendered on the left, inside the row. */
  label: string;
  /** Optional leading icon shown before the label. */
  icon?: LucideIcon;

  /** Controlled list of colours. Pair it with `onValueChange`. */
  value?: string[];
  /** Initial list in uncontrolled mode. */
  defaultValue?: string[];
  /** Fires on every edit: a colour adjustment, an added stop, a removed one. */
  onValueChange?: (value: string[]) => void;
  /**
   * Fires once an edit is finished — a drag released in the picker, a stop added
   * or removed. Use it for work too expensive to run per frame.
   */
  onValueCommit?: (value: string[]) => void;

  /**
   * Fewest colours the list may hold; the remove button stops there.
   * @defaultValue 1 */
  min?: number;
  /**
   * Most colours the list may hold; the add button stops there.
   * @defaultValue 5 */
  max?: number;
  /**
   * Colour appended by the add button.
   * @defaultValue "#ffffff" */
  newColor?: string;

  /**
   * Notation written back through the callbacks.
   * @defaultValue "hex" */
  format?: "hex" | "oklch" | "rgb";
  /** Carry an alpha channel, and show its row in the picker. */
  alpha?: boolean;
  /** Preset colours offered inside the picker. */
  swatches?: string[];

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
  /** Accessible name for the group. Falls back to `label`. */
  "aria-label"?: string;
}

export const inspectorMulticolorDemo: InspectorMulticolorProps = {
  label: "Color stops",
  className: "w-72",
  defaultValue: ["#3a29ff", "#ff94b4", "#ff3232"],
  min: 1,
  max: 5,
};

export function InspectorMulticolor({
  label,
  icon: Icon,
  value: valueProp,
  defaultValue,
  onValueChange,
  onValueCommit,
  min = 1,
  max = 5,
  newColor = "#ffffff",
  format = "hex",
  alpha = false,
  swatches,
  disabled = false,
  tone = "muted",
  size = "default",
  className,
  "aria-label": ariaLabel,
}: InspectorMulticolorProps) {
  const [internalValue, setInternalValue] = React.useState<string[]>(
    defaultValue ?? [newColor],
  );
  const colors = valueProp ?? internalValue;

  const write = (next: string[], complete: boolean) => {
    if (valueProp === undefined) setInternalValue(next);
    onValueChange?.(next);
    if (complete) onValueCommit?.(next);
  };

  const setColorAt = (index: number, color: string, complete: boolean) => {
    const next = colors.map((entry, position) => (position === index ? color : entry));
    write(next, complete);
  };

  // The buttons work on the end of the list, which keeps the row to two controls
  // however many stops there are, and keeps every swatch a colour target rather
  // than half a colour target and half a delete button.
  const addColor = () => {
    if (colors.length >= max) return;
    write([...colors, newColor], true);
  };

  const removeColor = () => {
    if (colors.length <= min) return;
    write(colors.slice(0, -1), true);
  };

  return (
    <div
      data-slot="inspector-multicolor"
      role="group"
      aria-label={ariaLabel ?? label}
      data-disabled={disabled}
      className={cn(
        "group/inspector-multicolor flex items-center gap-2",
        "h-(--inspector-height) rounded-(--inspector-radius) px-(--inspector-pad)",
        "[--inspector-radius:var(--radius-xl)]",
        "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
        sizeStyles[size],
        toneStyles[tone],
        className,
      )}
    >
      <span
        data-slot="inspector-multicolor-label"
        className="flex min-w-0 items-center gap-1.5 text-sm font-medium text-foreground/70 select-none"
      >
        {Icon ? <Icon className="size-4 shrink-0" /> : null}
        <span className="truncate">{label}</span>
      </span>

      <div
        data-slot="inspector-multicolor-swatches"
        className="ml-auto flex shrink-0 items-center gap-1"
      >
        {colors.map((color, index) => (
          // Keyed by position, never by colour: keying on the colour would remount
          // the popover on every adjustment and close the picker mid-drag.
          <Popover key={index}>
            <PopoverTrigger asChild>
              <button
                type="button"
                disabled={disabled}
                aria-label={`${label} ${index + 1}`}
                data-slot="inspector-multicolor-swatch"
                className={cn(
                  "relative size-5 shrink-0 cursor-pointer rounded-md border border-border",
                  "outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  "transition-transform hover:scale-110",
                )}
              >
                {alpha ? (
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 rounded-md text-foreground"
                    style={{ backgroundImage: ALPHA_CHECKER, backgroundSize: "6px 6px" }}
                  />
                ) : null}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-md"
                  style={{
                    backgroundColor: isRenderableColor(color) ? color : "transparent",
                  }}
                />
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" side="bottom" sideOffset={8} className="w-auto p-0">
              <ColorPicker
                color={color}
                format={format}
                alpha={alpha}
                swatches={swatches}
                onChange={(next) => setColorAt(index, next, false)}
                onChangeComplete={(next) => setColorAt(index, next, true)}
              />
            </PopoverContent>
          </Popover>
        ))}
      </div>

      <div
        data-slot="inspector-multicolor-controls"
        className="flex shrink-0 items-center gap-0.5"
      >
        <button
          type="button"
          onClick={removeColor}
          disabled={disabled || colors.length <= min}
          aria-label={`Remove the last ${label.toLowerCase()}`}
          className={COUNT_BUTTON}
        >
          <MinusIcon className="size-3.5" />
        </button>
        <button
          type="button"
          onClick={addColor}
          disabled={disabled || colors.length >= max}
          aria-label={`Add to ${label.toLowerCase()}`}
          className={COUNT_BUTTON}
        >
          <PlusIcon className="size-3.5" />
        </button>
      </div>
    </div>
  );
}

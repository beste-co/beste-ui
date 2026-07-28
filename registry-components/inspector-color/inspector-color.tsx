"use client";

import type { LucideIcon } from "lucide-react";
import * as React from "react";
import { ColorPicker } from "@/components/beste/component/color-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

/** Surface treatment of the row. Mirrors inspector-slider. */
type Tone = "muted" | "outline" | "ghost";

/** Row height preset. Mirrors inspector-slider. */
type Size = "sm" | "default" | "lg";

/**
 * The whole row presses, so each tone answers the hover the way inspector-select's
 * trigger does. These are our own classes on our own element, with no `dark:`
 * rule underneath to outrank them.
 */
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

/** Checkerboard shown behind a translucent swatch. */
const ALPHA_CHECKER =
  "conic-gradient(from 90deg at 50% 50%, color-mix(in srgb, currentColor 20%, transparent) 25%, transparent 0 50%, color-mix(in srgb, currentColor 20%, transparent) 0 75%, transparent 0)";

/** A bare hex, with or without its leading hash. */
const HEX_TEXT = /^#?([0-9a-f]{3,8})$/i;
/** Any of the CSS colour functions the picker understands or the browser renders. */
const COLOR_FUNCTION = /^(rgba?|oklch|hsla?|oklab|lab|lch|color)\(/i;

/** Accepts hex, `rgb()`/`rgba()` and `oklch()`; anything else keeps the swatch empty. */
function isRenderableColor(value: string | undefined): boolean {
  if (!value) return false;
  const candidate = value.trim();
  return HEX_TEXT.test(candidate) || COLOR_FUNCTION.test(candidate);
}

interface InspectorColorProps {
  /** Label rendered on the left, inside the row. */
  label: string;
  /** Optional leading icon shown before the label. */
  icon?: LucideIcon;

  /** Controlled colour. Pair it with `onValueChange`. */
  value?: string;
  /** Initial colour in uncontrolled mode. */
  defaultValue?: string;
  /** Fires on every adjustment, including each frame of a drag in the picker. */
  onValueChange?: (value: string) => void;
  /**
   * Fires once an adjustment is finished — a drag release, a committed edit, a
   * swatch click. Use it for work too expensive to run per frame.
   */
  onValueCommit?: (value: string) => void;
  /** Fires when the picker opens or closes. */
  onOpenChange?: (open: boolean) => void;

  /**
   * Notation written back through the callbacks.
   * @defaultValue "hex" */
  format?: "hex" | "oklch" | "rgb";
  /** Carry an alpha channel, and show its rail in the picker. */
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
  /** Accessible name. Falls back to `label`. */
  "aria-label"?: string;
}

// No `swatches`: presets are opt-in, so the picker opens without a swatch row.
export const inspectorColorDemo: InspectorColorProps = {
  label: "Color",
  className: "w-72",
  defaultValue: "#171717",
};

export function InspectorColor({
  label,
  icon: Icon,
  value: valueProp,
  defaultValue,
  onValueChange,
  onValueCommit,
  onOpenChange,
  format = "hex",
  alpha = false,
  swatches,
  disabled = false,
  tone = "muted",
  size = "default",
  className,
  "aria-label": ariaLabel,
}: InspectorColorProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? "#000000");
  const value = valueProp ?? internalValue;

  const commit = React.useCallback(
    (next: string, complete: boolean) => {
      if (valueProp === undefined) setInternalValue(next);
      onValueChange?.(next);
      if (complete) onValueCommit?.(next);
    },
    [valueProp, onValueChange, onValueCommit],
  );

  const swatchColor = isRenderableColor(value) ? value : "transparent";

  return (
    <Popover onOpenChange={onOpenChange}>
      {/*
        The whole row is the trigger. With the value read-only there is nothing
        else in the row to press, so a 20px circle would be a needlessly small
        target — and the row can say "Color, #171717" as its own accessible name
        instead of carrying a separate label for the swatch. Nothing interactive
        is nested inside, which is what makes a button legal here.
      */}
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          aria-label={ariaLabel}
          data-slot="inspector-color"
          data-disabled={disabled}
          className={cn(
            "group/inspector-color relative flex w-full cursor-pointer items-center gap-2 text-left select-none",
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
            data-slot="inspector-color-label"
            className="flex min-w-0 items-center gap-1.5 text-sm font-medium text-foreground/70"
          >
            {Icon ? <Icon className="size-4 shrink-0" /> : null}
            <span className="truncate">{label}</span>
          </span>

          {/*
            Read-only on purpose: a colour is edited in the picker, where a bad
            value can be seen as well as typed. A field here would also mean two
            places to keep in step.
          */}
          <span
            data-slot="inspector-color-value"
            className="ml-auto min-w-0 truncate font-mono text-sm font-medium text-foreground"
          >
            {value}
          </span>

          <span
            aria-hidden="true"
            data-slot="inspector-color-swatch"
            className={cn(
              "relative size-5 shrink-0 rounded-full border border-border",
              "transition-transform group-hover/inspector-color:scale-110",
            )}
          >
            {alpha ? (
              <span
                className="absolute inset-0 rounded-full text-foreground"
                style={{ backgroundImage: ALPHA_CHECKER, backgroundSize: "6px 6px" }}
              />
            ) : null}
            <span
              className="absolute inset-0 rounded-full"
              style={{ backgroundColor: swatchColor }}
            />
          </span>
        </button>
      </PopoverTrigger>

      <PopoverContent align="end" side="bottom" sideOffset={8} className="w-auto p-0">
        <ColorPicker
          color={value}
          format={format}
          alpha={alpha}
          swatches={swatches}
          onChange={(next) => commit(next, false)}
          onChangeComplete={(next) => commit(next, true)}
        />
      </PopoverContent>
    </Popover>
  );
}

"use client";

import { CheckIcon } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

/** Surface treatment of each option. Mirrors inspector-action. */
type Tone = "muted" | "outline" | "ghost";

/** Row height preset. Mirrors inspector-action. */
type Size = "sm" | "default" | "lg";

/**
 * The resting and hover surfaces come from inspector-action; the chosen option
 * takes the same `bg-foreground/10` inspector-segmented paints under its thumb,
 * so a picked row reads the same way a picked segment does.
 */
const toneStyles: Record<Tone, string> = {
  muted: "border border-transparent bg-muted hover:bg-muted-foreground/15",
  outline: "border border-border hover:bg-muted",
  ghost: "border border-transparent hover:border-border hover:bg-muted",
};

const selectedStyles: Record<Tone, string> = {
  muted: "border border-transparent bg-foreground/10 hover:bg-foreground/15",
  outline: "border border-foreground/40 bg-foreground/10",
  ghost: "border border-transparent bg-foreground/10 hover:bg-foreground/15",
};

const sizeStyles: Record<Size, string> = {
  sm: "[--inspector-height:--spacing(8)] [--inspector-pad:--spacing(2.5)]",
  default: "[--inspector-height:--spacing(9)] [--inspector-pad:--spacing(3)]",
  lg: "[--inspector-height:--spacing(11)] [--inspector-pad:--spacing(4)]",
};

export interface InspectorChoiceOption {
  /** Value reported on selection. */
  value: string;
  /** Text shown on the row. */
  label: string;
  /** Second line under the label: what picking this one means. */
  description?: string;
  /** A small pill right after the label: "Current", "New", "Beta". One or two words. */
  badge?: string;
  /** Read-only text on the right: a count, a price, a date. */
  hint?: React.ReactNode;
  /** A small mark right before the label, on its line: a swatch, a glyph. Sized by the caller. */
  leading?: React.ReactNode;
  disabled?: boolean;
}

interface InspectorChoiceProps {
  /** The options, in the order they are listed. */
  options: InspectorChoiceOption[];
  /** Controlled value. Pair it with `onValueChange`. */
  value?: string;
  /** Initial value in uncontrolled mode. */
  defaultValue?: string;
  onValueChange?: (value: string) => void;

  /**
   * Accessible name for the group. There is no visible heading: a choice list
   * sits under an inspector-group or a dialog title that already names it.
   */
  "aria-label"?: string;
  /**
   * Lay the options out in two columns. One column reads better when the
   * descriptions are sentences; two when they are a few words.
   * @defaultValue 1 */
  columns?: 1 | 2;

  /** Block interaction and dim the list. */
  disabled?: boolean;
  /**
   * Surface treatment: filled (default), hairline outline, or bare until hover.
   * @defaultValue "muted" */
  tone?: Tone;
  /**
   * Row height preset. A description makes a row taller than the preset; the
   * preset is then the floor.
   * @defaultValue "default" */
  size?: Size;
  className?: string;
}

/**
 * A short list of named choices, one of which is on: a plan, a studio look, a
 * delivery option. Each row carries its own label and, when it needs one, a
 * line saying what picking it means, so the list can stand in for a menu
 * whose options are worth reading rather than scanning.
 *
 * Use inspector-select when there are more than five or six, and
 * inspector-segmented when the options are one word each.
 */
export function InspectorChoice({
  options,
  value,
  defaultValue,
  onValueChange,
  "aria-label": ariaLabel,
  columns = 1,
  disabled = false,
  tone = "muted",
  size = "default",
  className,
}: InspectorChoiceProps) {
  const [internal, setInternal] = React.useState(defaultValue ?? "");
  const current = value ?? internal;

  const pick = (next: string) => {
    if (value === undefined) setInternal(next);
    onValueChange?.(next);
  };

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      data-slot="inspector-choice"
      data-disabled={disabled}
      className={cn(
        "grid gap-1.5",
        columns === 2 ? "grid-cols-2" : "grid-cols-1",
        "[--inspector-radius:var(--radius-xl)]",
        "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
        sizeStyles[size],
        className,
      )}
    >
      {options.map((option) => {
        const isSelected = option.value === current;
        const blocked = disabled || option.disabled;

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={blocked}
            onClick={() => pick(option.value)}
            data-slot="inspector-choice-option"
            data-state={isSelected ? "checked" : "unchecked"}
            className={cn(
              "flex w-full items-center gap-2 text-left transition-colors",
              option.description ? "min-h-(--inspector-height) py-2" : "h-(--inspector-height)",
              "rounded-(--inspector-radius) px-(--inspector-pad)",
              "outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              "disabled:pointer-events-none disabled:opacity-50",
              blocked ? "" : "cursor-pointer",
              isSelected ? selectedStyles[tone] : toneStyles[tone],
            )}
          >
            <span className="flex min-w-0 flex-1 flex-col items-start gap-0.5">
              <span className="flex min-w-0 max-w-full items-center gap-1.5 select-none">
                {option.leading !== undefined && option.leading !== null && (
                  <span className="flex shrink-0 items-center">{option.leading}</span>
                )}
                <span className="truncate text-sm font-medium">{option.label}</span>
                {option.badge && (
                  <span className="shrink-0 rounded-full border border-border bg-background px-1.5 py-px text-[11px] font-medium leading-4 text-muted-foreground">
                    {option.badge}
                  </span>
                )}
              </span>
              {option.description && (
                <span
                  // One line on a phone, where a wrapped description would push
                  // the list down the screen; free to wrap once there is room
                  className="w-full truncate text-xs leading-snug text-muted-foreground select-none md:overflow-visible md:whitespace-normal md:text-clip"
                  title={option.description}
                >
                  {option.description}
                </span>
              )}
            </span>
            {option.hint !== undefined && option.hint !== null && (
              <span className="shrink-0 text-xs text-muted-foreground tabular-nums select-none">
                {option.hint}
              </span>
            )}
            <CheckIcon
              aria-hidden
              className={cn("size-4 shrink-0 transition-opacity", isSelected ? "opacity-100" : "opacity-0")}
            />
          </button>
        );
      })}
    </div>
  );
}

export const inspectorChoiceDemo: InspectorChoiceProps = {
  "aria-label": "Plan",
  defaultValue: "pro",
  className: "w-80",
  options: [
    { value: "free", label: "Free", description: "One site, community support" },
    { value: "pro", label: "Pro", description: "Unlimited sites, custom domains", badge: "Current" },
    { value: "agency", label: "Agency", description: "Twenty five sites and invites" },
  ],
};

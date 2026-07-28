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
  ghost: "border border-transparent hover:border-border",
};

const sizeStyles: Record<Size, string> = {
  sm: "[--inspector-height:--spacing(8)] [--inspector-pad:--spacing(2.5)]",
  default: "[--inspector-height:--spacing(9)] [--inspector-pad:--spacing(3)]",
  lg: "[--inspector-height:--spacing(11)] [--inspector-pad:--spacing(4)]",
};

interface InspectorSegmentedOption {
  /** Value reported on selection. */
  value: string;
  /** Text on the segment. Falls back to `value`. */
  label?: string;
  /** Icon on the segment. Shown alone when there is no label. */
  icon?: LucideIcon;
  disabled?: boolean;
}

interface InspectorSegmentedProps {
  /** Label rendered on the left, inside the row. */
  label: string;
  /** Optional leading icon shown before the label. */
  icon?: LucideIcon;

  /**
   * The choices. Plain strings are enough when the value is the text. Two to four
   * segments is the range this reads well at; past that reach for
   * inspector-select.
   */
  options?: (string | InspectorSegmentedOption)[];

  /** Controlled value. Pair it with `onValueChange`. */
  value?: string;
  /** Initial value in uncontrolled mode. Falls back to the first option. */
  defaultValue?: string;
  onValueChange?: (value: string) => void;

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

  /** Name shared by the underlying radios, so the row can take part in a form. */
  name?: string;
  className?: string;
  /** Accessible name for the group. Falls back to `label`. */
  "aria-label"?: string;
}

export const inspectorSegmentedDemo: InspectorSegmentedProps = {
  label: "Dark Mode",
  className: "w-72",
  options: [
    { value: "off", label: "Off" },
    { value: "on", label: "On" },
  ],
  defaultValue: "off",
};

export function InspectorSegmented({
  label,
  icon: Icon,
  options = [],
  value: valueProp,
  defaultValue,
  onValueChange,
  disabled = false,
  tone = "muted",
  size = "default",
  name,
  className,
  "aria-label": ariaLabel,
}: InspectorSegmentedProps) {
  const items = React.useMemo(
    () =>
      options
        .map((entry) => (typeof entry === "string" ? { value: entry } : entry))
        .filter((option) => option.value),
    [options],
  );

  const [internalValue, setInternalValue] = React.useState(
    defaultValue ?? items[0]?.value ?? "",
  );
  const value = valueProp ?? internalValue;

  const generatedName = React.useId();
  const groupName = name ?? generatedName;

  const selectedIndex = items.findIndex((option) => option.value === value);

  const select = (next: string) => {
    if (valueProp === undefined) setInternalValue(next);
    onValueChange?.(next);
  };

  return (
    <div
      data-slot="inspector-segmented"
      data-disabled={disabled}
      className={cn(
        "group/inspector-segmented flex items-center gap-2",
        "h-(--inspector-height) rounded-(--inspector-radius) px-(--inspector-pad)",
        "[--inspector-radius:var(--radius-xl)]",
        "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
        sizeStyles[size],
        toneStyles[tone],
        className,
      )}
    >
      <span
        data-slot="inspector-segmented-label"
        className="flex min-w-0 items-center gap-1.5 text-sm font-medium text-foreground/70 select-none"
      >
        {Icon ? <Icon className="size-4 shrink-0" /> : null}
        <span className="truncate">{label}</span>
      </span>

      {/*
        Radios rather than buttons: keyboard selection with the arrow keys, the
        group semantics and taking part in a form all come from the platform, and
        each input is only hidden, never removed.
      */}
      <div
        role="radiogroup"
        aria-label={ariaLabel ?? label}
        data-slot="inspector-segmented-track"
        className="relative ml-auto grid shrink-0 items-center"
        style={{ gridTemplateColumns: `repeat(${Math.max(items.length, 1)}, minmax(0, 1fr))` }}
      >
        {/*
          Equal-width segments mean the marker can be placed by index alone — no
          measuring, and the slide runs on the compositor.
        */}
        <span
          aria-hidden="true"
          data-slot="inspector-segmented-marker"
          className={cn(
            "pointer-events-none absolute inset-y-0 left-0 rounded-md bg-foreground/10",
            "motion-safe:transition-transform motion-safe:duration-200",
            selectedIndex < 0 && "opacity-0",
          )}
          style={{
            width: `${100 / Math.max(items.length, 1)}%`,
            transform: `translateX(${Math.max(selectedIndex, 0) * 100}%)`,
          }}
        />

        {items.map((option) => {
          const OptionIcon = option.icon;
          const isSelected = option.value === value;
          const text = option.label ?? option.value;

          return (
            <label
              key={option.value}
              data-slot="inspector-segmented-item"
              data-state={isSelected ? "on" : "off"}
              className={cn(
                "relative flex h-6 min-w-0 cursor-pointer items-center justify-center gap-1.5 px-2.5",
                "rounded-md text-sm font-medium transition-colors select-none",
                "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring/50",
                isSelected ? "text-foreground" : "text-foreground/70 hover:text-foreground",
                option.disabled && "pointer-events-none opacity-50",
              )}
            >
              <input
                type="radio"
                name={groupName}
                value={option.value}
                checked={isSelected}
                disabled={disabled || option.disabled}
                onChange={() => select(option.value)}
                className="sr-only"
              />
              {OptionIcon ? (
                <OptionIcon className="size-4 shrink-0" aria-label={option.label ? undefined : text} />
              ) : null}
              {option.label || !OptionIcon ? <span className="truncate">{text}</span> : null}
            </label>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import {
  type LucideIcon,
  PanelBottomIcon,
  PanelLeftIcon,
  PanelRightIcon,
  PanelTopIcon,
} from "lucide-react";
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

interface InspectorTogglesOption {
  /** Value carried in the array while this toggle is on. */
  value: string;
  /** Text on the pill. Falls back to `value`. */
  label?: string;
  /** Icon on the pill. Shown alone when there is no label. */
  icon?: LucideIcon;
  disabled?: boolean;
}

interface InspectorTogglesProps {
  /** Label rendered on the left, inside the row. */
  label: string;
  /** Optional leading icon shown before the label. */
  icon?: LucideIcon;

  /**
   * The toggles. Plain strings are enough when the value is the text. Past three
   * or four with words, give them icons instead: the row is one line tall and a
   * set of pills is only useful while it fits on it.
   */
  options?: (string | InspectorTogglesOption)[];

  /** Controlled value. Pair it with `onValueChange`. */
  value?: string[];
  /** Initial value in uncontrolled mode. */
  defaultValue?: string[];
  /**
   * Fires on every toggle, with the values in the order `options` gives them —
   * never in the order they were pressed, so the array can be compared and
   * stored as-is.
   */
  onValueChange?: (value: string[]) => void;

  /**
   * Fewest toggles that may be on. The last one on stops answering rather than
   * disappearing, since a pill that vanishes at the boundary is worse than one
   * that plainly refuses.
   * @defaultValue 0 */
  min?: number;
  /**
   * Most toggles that may be on. Once reached, the ones still off dim, which is
   * the only way a reader can tell why pressing them does nothing.
   */
  max?: number;

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

  /** Name shared by the underlying checkboxes, so the row can take part in a form. */
  name?: string;
  className?: string;
  /** Accessible name for the group. Falls back to `label`. */
  "aria-label"?: string;
}

export const inspectorTogglesDemo: InspectorTogglesProps = {
  label: "Borders",
  className: "w-72",
  // Four sides fit only as icons, which is the case this row is really for.
  options: [
    { value: "left", icon: PanelLeftIcon },
    { value: "right", icon: PanelRightIcon },
    { value: "top", icon: PanelTopIcon },
    { value: "bottom", icon: PanelBottomIcon },
  ],
  defaultValue: ["left", "right", "bottom"],
};

export function InspectorToggles({
  label,
  icon: Icon,
  options = [],
  value: valueProp,
  defaultValue,
  onValueChange,
  min = 0,
  max,
  disabled = false,
  tone = "muted",
  size = "default",
  name,
  className,
  "aria-label": ariaLabel,
}: InspectorTogglesProps) {
  const items = React.useMemo(
    () =>
      options
        .map((entry) => (typeof entry === "string" ? { value: entry } : entry))
        .filter((option) => option.value),
    [options],
  );

  const [internalValue, setInternalValue] = React.useState<string[]>(defaultValue ?? []);
  const value = valueProp ?? internalValue;

  const generatedName = React.useId();
  const groupName = name ?? generatedName;

  const on = React.useMemo(() => new Set(value), [value]);
  const limit = max ?? items.length;
  const atMin = on.size <= min;
  const atMax = on.size >= limit;

  const toggle = (target: string) => {
    // Rebuilt from `items` rather than pushed onto the old array, so the result
    // always reads in the order the options were declared.
    const next = items
      .filter((option) => (option.value === target ? !on.has(option.value) : on.has(option.value)))
      .map((option) => option.value);
    if (valueProp === undefined) setInternalValue(next);
    onValueChange?.(next);
  };

  return (
    <div
      data-slot="inspector-toggles"
      data-disabled={disabled}
      className={cn(
        "group/inspector-toggles flex items-center gap-2",
        "h-(--inspector-height) rounded-(--inspector-radius) px-(--inspector-pad)",
        "[--inspector-radius:var(--radius-xl)]",
        "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
        sizeStyles[size],
        toneStyles[tone],
        className,
      )}
    >
      <span
        data-slot="inspector-toggles-label"
        className="flex min-w-0 items-center gap-1.5 text-sm font-medium text-foreground/70 select-none"
      >
        {Icon ? <Icon className="size-4 shrink-0" /> : null}
        <span className="truncate">{label}</span>
      </span>

      {/*
        Checkboxes rather than buttons, and a group rather than a radiogroup:
        several of these are on at once, so Tab reaches each one and Space works
        it, all of which the platform already does. There is no sliding marker
        for the same reason — the mark has to be able to be in four places at
        once, so it lives on the pill.
      */}
      <div
        role="group"
        aria-label={ariaLabel ?? label}
        data-slot="inspector-toggles-track"
        className="ml-auto flex shrink-0 items-center gap-0.5"
      >
        {items.map((option) => {
          const OptionIcon = option.icon;
          const isOn = on.has(option.value);
          const text = option.label ?? option.value;
          const iconOnly = Boolean(OptionIcon && !option.label);
          /*
           * Held on by `min`: the input stays enabled so a checked value is still
           * submitted with the form — disabling it would drop it silently — and
           * only the change is refused.
           */
          const held = isOn && atMin;
          /* Blocked by `max`: nothing to submit either way, so this one can be a
             real disabled input. */
          const blocked = !isOn && atMax;

          return (
            <label
              key={option.value}
              title={iconOnly ? text : undefined}
              data-slot="inspector-toggles-item"
              data-state={isOn ? "on" : "off"}
              className={cn(
                "relative flex h-6 min-w-0 items-center justify-center gap-1.5",
                "rounded-md text-sm font-medium transition-colors select-none",
                iconOnly ? "w-7" : "px-2.5",
                "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring/50",
                isOn ? "bg-foreground/10 text-foreground" : "text-foreground/70",
                !isOn && !blocked && "hover:text-foreground",
                held ? "cursor-default" : "cursor-pointer",
                (option.disabled || blocked) && "pointer-events-none opacity-50",
              )}
            >
              <input
                type="checkbox"
                name={groupName}
                value={option.value}
                checked={isOn}
                disabled={disabled || option.disabled || blocked}
                aria-disabled={held || undefined}
                aria-label={iconOnly ? text : undefined}
                onChange={() => {
                  if (held) return;
                  toggle(option.value);
                }}
                className="sr-only"
              />
              {OptionIcon ? <OptionIcon className="size-4 shrink-0" /> : null}
              {option.label || !OptionIcon ? <span className="truncate">{text}</span> : null}
            </label>
          );
        })}
      </div>
    </div>
  );
}

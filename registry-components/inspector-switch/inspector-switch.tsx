"use client";

import type { LucideIcon } from "lucide-react";
import * as React from "react";
import { Switch } from "@/components/ui/switch";
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

/**
 * Two corrections to the shadcn switch, so it sits properly in a tinted row.
 *
 * An unchecked switch is `bg-input`, which is close enough to `bg-muted` to go
 * quiet on this surface, so the off state gets a hairline instead. And its own
 * focus ring is dropped in favour of one on the row, which reads better around a
 * control this small — and gives the row a focus indicator in flavours of the
 * switch that ship without one.
 */
const SWITCH_IN_ROW = "data-[state=unchecked]:border-border focus-visible:ring-0";

interface InspectorSwitchProps {
  /** Label rendered on the left, inside the row. */
  label: string;
  /** Optional leading icon shown before the label. */
  icon?: LucideIcon;

  /**
   * Controlled state. Named after the switch rather than the family's `value`,
   * because every switch in this codebase already speaks
   * `checked`/`onCheckedChange`.
   */
  checked?: boolean;
  /** Initial state in uncontrolled mode. */
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;

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

  /** Name of the underlying control, so the row can take part in a form. */
  name?: string;
  /** Id of the switch. Generated when omitted, to tie the label to it. */
  id?: string;
  className?: string;
  /** Accessible name. Falls back to the visible label. */
  "aria-label"?: string;
}

export const inspectorSwitchDemo: InspectorSwitchProps = {
  label: "Parallax",
  className: "w-72",
  defaultChecked: true,
};

export function InspectorSwitch({
  label,
  icon: Icon,
  checked: checkedProp,
  defaultChecked,
  onCheckedChange,
  disabled = false,
  tone = "muted",
  size = "default",
  name,
  id,
  className,
  "aria-label": ariaLabel,
}: InspectorSwitchProps) {
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked ?? false);
  const checked = checkedProp ?? internalChecked;

  const generatedId = React.useId();
  const switchId = id ?? generatedId;

  const handleCheckedChange = (next: boolean) => {
    if (checkedProp === undefined) setInternalChecked(next);
    onCheckedChange?.(next);
  };

  return (
    <div
      data-slot="inspector-switch"
      data-disabled={disabled}
      className={cn(
        "group/inspector-switch flex items-center gap-2",
        "h-(--inspector-height) rounded-(--inspector-radius) px-(--inspector-pad)",
        "[--inspector-radius:var(--radius-xl)]",
        "has-[[data-slot=switch]:focus-visible]:ring-2 has-[[data-slot=switch]:focus-visible]:ring-ring/50 has-[[data-slot=switch]:focus-visible]:ring-offset-2 has-[[data-slot=switch]:focus-visible]:ring-offset-background",
        "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
        sizeStyles[size],
        toneStyles[tone],
        className,
      )}
    >
      {/*
        `htmlFor` rather than wrapping the switch: the switch renders a button and,
        with `name`, a hidden checkbox too, and a wrapping label would have to
        guess which of the two it labels. Giving the label the row's spare width
        means a press almost anywhere toggles, without any of that ambiguity.
      */}
      <label
        htmlFor={switchId}
        data-slot="inspector-switch-label"
        className="flex min-w-0 flex-1 cursor-pointer items-center gap-1.5 text-sm font-medium text-foreground/70 select-none"
      >
        {Icon ? <Icon className="size-4 shrink-0" /> : null}
        <span className="truncate">{label}</span>
      </label>

      <Switch
        id={switchId}
        name={name}
        checked={checked}
        onCheckedChange={handleCheckedChange}
        disabled={disabled}
        aria-label={ariaLabel}
        className={cn("shrink-0 cursor-pointer", SWITCH_IN_ROW)}
      />
    </div>
  );
}

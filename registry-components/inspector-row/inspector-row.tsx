"use client";

import type { LucideIcon } from "lucide-react";
import type * as React from "react";
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

interface InspectorRowProps {
  /** Label rendered on the left, inside the row. */
  label: string;
  /** Optional leading icon shown before the label. */
  icon?: LucideIcon;

  /** The control. Anything at all: this row makes no assumptions about it. */
  children?: React.ReactNode;

  /**
   * Id of the control inside, which makes the label name it: a press on the label
   * then reaches the control the way it does in the rest of the family.
   */
  htmlFor?: string;
  /**
   * Let the row grow past one line, for a control that cannot be one line tall.
   * The label then sits at the top rather than centred against it.
   */
  multiline?: boolean;

  /** Dim the row. What is inside it stays the caller's business. */
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
}

export const inspectorRowDemo: InspectorRowProps = {
  label: "Custom",
  className: "w-72",
  children: (
    <span className="ml-auto text-sm font-medium text-foreground">Whatever you put here</span>
  ),
};

/**
 * The escape hatch. Every other row in the family owns a value and a gesture; this
 * one owns only the label, the surface and the metrics, so a control the family
 * does not have yet still sits in a drawer looking like it belongs.
 *
 * Reach for it when a bespoke control has to live beside the real rows, not as a
 * way to build the next one: a row that owns its value can do things a wrapper
 * cannot, starting with knowing what a press on its label should mean.
 */
export function InspectorRow({
  label,
  icon: Icon,
  children,
  htmlFor,
  multiline = false,
  disabled = false,
  tone = "muted",
  size = "default",
  className,
}: InspectorRowProps) {
  const Label = htmlFor ? "label" : "span";

  return (
    <div
      data-slot="inspector-row"
      data-disabled={disabled}
      className={cn(
        "group/inspector-row flex gap-2",
        "rounded-(--inspector-radius) px-(--inspector-pad)",
        "[--inspector-radius:var(--radius-xl)]",
        multiline
          ? "min-h-(--inspector-height) flex-col py-(--inspector-pad)"
          : "h-(--inspector-height) items-center",
        "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring/50 has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-background",
        "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
        sizeStyles[size],
        toneStyles[tone],
        className,
      )}
    >
      <Label
        htmlFor={htmlFor}
        data-slot="inspector-row-label"
        className={cn(
          "flex min-w-0 items-center gap-1.5 text-sm font-medium text-foreground/70 select-none",
          htmlFor && "cursor-pointer",
        )}
      >
        {Icon ? <Icon className="size-4 shrink-0" /> : null}
        <span className="truncate">{label}</span>
      </Label>

      {children}
    </div>
  );
}

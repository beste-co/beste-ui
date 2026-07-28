"use client";

import { ChevronRightIcon, Loader2Icon, type LucideIcon } from "lucide-react";
import type * as React from "react";
import { cn } from "@/lib/utils";

/** Surface treatment of the row. Mirrors inspector-slider. */
type Tone = "muted" | "outline" | "ghost";

/** Row height preset. Mirrors inspector-slider. */
type Size = "sm" | "default" | "lg";

/** The whole row presses, so it answers hover the way inspector-icon's does. */
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

interface InspectorActionProps {
  /** What the row does, in the imperative: "Open asset library", "Regenerate key". */
  label: string;
  /** Optional leading icon shown before the label. */
  icon?: LucideIcon;
  /**
   * A second line under the label, for a consequence a verb cannot carry — what
   * gets lost, what it costs, what happens next.
   */
  description?: string;
  /** Read-only text on the right, before the trailing glyph: a count, a state. */
  hint?: React.ReactNode;

  /** What the press does. */
  onClick?: () => void;
  /**
   * Where the press goes, for an action that is a link. Renders a plain anchor —
   * a registry component takes no view on which router the project uses.
   */
  href?: string;
  /** Open the link in a new tab, with the `rel` that has to come with it. */
  newTab?: boolean;

  /**
   * Glyph at the far right. A chevron by default, which is right for a row that
   * opens something; pass `null` for one that acts in place.
   */
  trailingIcon?: LucideIcon | null;
  /** Paint it as destructive. The glyph and the label go red, the surface does not. */
  destructive?: boolean;
  /**
   * Work is in flight: a spinner replaces the trailing glyph and the row stops
   * answering, so the same press cannot be made twice.
   */
  busy?: boolean;

  /** Block interaction and dim the row. */
  disabled?: boolean;
  /**
   * Surface treatment: filled (default), hairline outline, or bare until hover.
   * @defaultValue "muted" */
  tone?: Tone;
  /**
   * Row height preset. A description makes the row taller than this on its own.
   * @defaultValue "default" */
  size?: Size;

  className?: string;
  /** Accessible name. Falls back to `label`. */
  "aria-label"?: string;
}

/*
 * One line, an imperative verb and the chevron: the demo has to say at a glance
 * that this row *goes somewhere* rather than holding a value, which is the whole
 * difference between it and every other row in the family. A description under it
 * made the row two lines tall and buried that.
 */
export const inspectorActionDemo: InspectorActionProps = {
  label: "Open asset library",
  className: "w-72",
};

/**
 * The row that does something instead of holding something.
 *
 * Every other row in the family owns a value; a panel also needs the presses that
 * are not values — open a sub-panel, replace an asset, regenerate a key, delete the
 * section — and hand-rolled buttons in a drawer of rows never quite line up with
 * them. inspector-row could hold a button, but a row that *is* the press can carry
 * the description, the chevron and the busy state, which a wrapper cannot.
 */
export function InspectorAction({
  label,
  icon: Icon,
  description,
  hint,
  onClick,
  href,
  newTab = false,
  trailingIcon,
  destructive = false,
  busy = false,
  disabled = false,
  tone = "muted",
  size = "default",
  className,
  "aria-label": ariaLabel,
}: InspectorActionProps) {
  // `undefined` means "the default chevron"; `null` means "no glyph at all", which
  // is a distinction a row that acts in place needs to be able to make.
  const TrailingIcon = trailingIcon === undefined ? ChevronRightIcon : trailingIcon;
  const blocked = disabled || busy;

  const body = (
    <>
      <span className="flex min-w-0 flex-1 flex-col items-start gap-0.5">
        <span
          data-slot="inspector-action-label"
          className={cn(
            "flex min-w-0 max-w-full items-center gap-1.5 text-sm font-medium select-none",
            destructive ? "text-destructive" : "text-foreground",
          )}
        >
          {Icon ? <Icon className="size-4 shrink-0" /> : null}
          <span className="truncate">{label}</span>
        </span>
        {description ? (
          <span
            data-slot="inspector-action-description"
            className="min-w-0 max-w-full truncate text-sm text-foreground/70 select-none"
          >
            {description}
          </span>
        ) : null}
      </span>

      {hint !== undefined && hint !== null ? (
        <span
          data-slot="inspector-action-hint"
          className="min-w-0 shrink truncate text-sm text-foreground/70 select-none"
        >
          {hint}
        </span>
      ) : null}

      {busy ? (
        <Loader2Icon
          aria-hidden="true"
          className="size-4 shrink-0 text-foreground/70 motion-safe:animate-spin"
        />
      ) : TrailingIcon ? (
        <TrailingIcon
          aria-hidden="true"
          className={cn(
            "size-4 shrink-0",
            destructive ? "text-destructive/70" : "text-foreground/70",
          )}
        />
      ) : null}
    </>
  );

  const shared = cn(
    "group/inspector-action flex w-full items-center gap-2 text-left",
    // A description makes the row two lines, so the height is a floor rather than a
    // height — the same choice inspector-note made for the same reason.
    description
      ? "min-h-(--inspector-height) py-2"
      : "h-(--inspector-height)",
    "rounded-(--inspector-radius) px-(--inspector-pad)",
    "[--inspector-radius:var(--radius-xl)] transition-colors",
    "outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
    blocked ? "" : "cursor-pointer",
    sizeStyles[size],
    toneStyles[tone],
    className,
  );

  if (href && !blocked) {
    return (
      <a
        href={href}
        target={newTab ? "_blank" : undefined}
        rel={newTab ? "noreferrer noopener" : undefined}
        onClick={onClick}
        aria-label={ariaLabel}
        data-slot="inspector-action"
        data-disabled={false}
        className={shared}
      >
        {body}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={blocked}
      aria-label={ariaLabel}
      aria-busy={busy || undefined}
      data-slot="inspector-action"
      data-disabled={blocked}
      className={shared}
    >
      {body}
    </button>
  );
}

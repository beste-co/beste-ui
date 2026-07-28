"use client";

import {
  AlertTriangleIcon,
  InfoIcon,
  type LucideIcon,
  OctagonAlertIcon,
} from "lucide-react";
import type * as React from "react";
import { cn } from "@/lib/utils";

/**
 * How loud the note is. Unlike the rest of the family, where `tone` picks a
 * surface, here it says what kind of thing is being said — which is the same
 * decision, since that is exactly what the surface is for.
 */
type Tone = "muted" | "info" | "warning" | "danger";

/** Padding preset. Mirrors inspector-slider's, with its height as a floor. */
type Size = "sm" | "default" | "lg";

const toneStyles: Record<Tone, string> = {
  muted: "bg-muted text-foreground/70",
  info: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
  warning: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  danger: "bg-destructive/10 text-destructive",
};

/*
 * The vertical padding that makes a one-line note measure exactly what a row of
 * the family measures: half of whatever the row height has left over after a line
 * of `text-sm`. At the default that is (36 - 20) / 2 = 8px.
 *
 * It has to be its own number rather than the horizontal pad. Sharing one value
 * for both axes is what made the note four pixels taller than every row beside
 * it, and matching the rows on height by shrinking the pad would have pulled the
 * text off the left edge they all share.
 */
const sizeStyles: Record<Size, string> = {
  sm: "[--inspector-height:--spacing(8)] [--inspector-pad:--spacing(2.5)] [--inspector-note-pad-y:--spacing(1.5)]",
  default: "[--inspector-height:--spacing(9)] [--inspector-pad:--spacing(3)] [--inspector-note-pad-y:--spacing(2)]",
  lg: "[--inspector-height:--spacing(11)] [--inspector-pad:--spacing(4)] [--inspector-note-pad-y:--spacing(3)]",
};

/** What each tone brings with it, so the reader is not told by colour alone. */
const toneIcons: Record<Tone, LucideIcon | null> = {
  muted: null,
  info: InfoIcon,
  warning: AlertTriangleIcon,
  danger: OctagonAlertIcon,
};

interface InspectorNoteProps {
  /** The note. One or two sentences: anything longer belongs in the docs. */
  children?: React.ReactNode;

  /**
   * What kind of note this is, which is also how it looks.
   * @defaultValue "muted" */
  tone?: Tone;
  /**
   * Padding preset.
   * @defaultValue "default" */
  size?: Size;
  /**
   * Icon shown before the text. Each tone but `muted` brings its own, so this is
   * for replacing one, or for giving `muted` a mark of its own.
   */
  icon?: LucideIcon;
  /** Drop the icon the tone brought with it. */
  hideIcon?: boolean;

  className?: string;
}

export const inspectorNoteDemo: InspectorNoteProps = {
  className: "w-72",
  tone: "warning",
  children: "Applies to every breakpoint.",
};

/**
 * The line of prose that sits between rows: what a setting is for, why one is off,
 * what a value will cost. It is not a row and owns no value, so it carries no
 * label and no fixed height — just the family's surface, the same text size, and
 * the row height as a floor, so a one-line note lines up with the controls around
 * it and a longer one is free to grow. Notes written by hand end up a size smaller
 * than everything around them every time.
 */
export function InspectorNote({
  children,
  tone = "muted",
  size = "default",
  icon,
  hideIcon = false,
  className,
}: InspectorNoteProps) {
  const Icon = hideIcon ? null : (icon ?? toneIcons[tone]);

  return (
    <div
      // Assertive tones are announced when they appear, since a warning that turns
      // up beside a control the reader is already using has to reach them.
      role={tone === "muted" || tone === "info" ? undefined : "status"}
      data-slot="inspector-note"
      data-tone={tone}
      className={cn(
        "flex items-start gap-2 rounded-(--inspector-radius)",
        // A note is prose and grows with it, so the row height is a floor rather
        // than a height: one line sits at exactly the family's 36px, and a second
        // line pushes the box down instead of being cropped by it.
        "min-h-(--inspector-height) px-(--inspector-pad) py-(--inspector-note-pad-y)",
        "[--inspector-radius:var(--radius-lg)] text-sm",
        sizeStyles[size],
        toneStyles[tone],
        className,
      )}
    >
      {Icon ? <Icon aria-hidden="true" className="mt-0.5 size-4 shrink-0" /> : null}
      <span data-slot="inspector-note-text" className="min-w-0">
        {children}
      </span>
    </div>
  );
}

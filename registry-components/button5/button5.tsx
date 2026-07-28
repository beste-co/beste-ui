"use client";

import { Slot } from "@radix-ui/react-slot";
import { ChevronDown, type LucideIcon } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "dark" | "primary" | "outline";

interface Button5Props {
  /** Main action label */
  label: string;
  /**
   * Compose the MAIN segment shadcn-style (radix asChild): your element
   * (e.g. a router Link) becomes the main control and the label is injected
   * as its children. Pass the element without children of its own.
   */
  asChild?: boolean;
  /** The element to render for the main segment when `asChild` is set */
  children?: React.ReactElement;
  /**
   * Fallback link for the main segment: renders a plain `<a>`. Prefer
   * `asChild` with your framework's Link component.
   */
  href?: string;
  /** Main action click handler (used when there is no href and no asChild) */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  /** Icon of the secondary segment (defaults to ChevronDown) */
  secondaryIcon?: LucideIcon;
  /** Accessible name of the secondary segment */
  secondaryLabel?: string;
  /** Secondary segment click handler (e.g. open a menu) */
  onSecondaryClick?: React.MouseEventHandler<HTMLButtonElement>;
  /** Surface tone: solid dark (default), primary, or bordered outline */
  tone?: Tone;
  /** Additional classes merged onto the root */
  className?: string;
}

const toneStyles: Record<Tone, { root: string; segment: string; divider: string }> = {
  dark: {
    root: "bg-foreground text-background",
    segment: "hover:bg-background/15",
    divider: "bg-background/25",
  },
  primary: {
    root: "bg-primary text-primary-foreground",
    segment: "hover:bg-primary-foreground/15",
    divider: "bg-primary-foreground/25",
  },
  outline: {
    root: "border bg-background text-foreground",
    segment: "hover:bg-muted",
    divider: "bg-border",
  },
};

export const button5Demo: Button5Props = {
  label: "Deploy now",
  secondaryLabel: "Deployment options",
};

const segmentBase =
  "flex cursor-pointer items-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring";

/**
 * A split button: the main action and a separated secondary trigger (menu,
 * options, alternate action) share one pill. Each segment is its own
 * focusable control.
 */
export function Button5({
  label,
  asChild = false,
  children,
  href,
  onClick,
  secondaryIcon: SecondaryIcon = ChevronDown,
  secondaryLabel = "More options",
  onSecondaryClick,
  tone = "dark",
  className,
}: Button5Props) {
  const styles = toneStyles[tone];

  const mainClasses = cn(segmentBase, "px-5 py-2.5 text-base font-semibold", styles.segment);

  const mainSegment =
    asChild && React.isValidElement(children) ? (
      <Slot className={mainClasses}>
        {React.cloneElement(children, undefined, label)}
      </Slot>
    ) : href ? (
      <a href={href} className={mainClasses}>
        {label}
      </a>
    ) : (
      <button type="button" onClick={onClick} className={mainClasses}>
        {label}
      </button>
    );

  return (
    <span
      className={cn(
        "inline-flex w-fit items-stretch overflow-hidden rounded-md",
        styles.root,
        className
      )}
    >
      {mainSegment}
      <span aria-hidden="true" className={cn("w-px self-stretch", styles.divider)} />
      <button
        type="button"
        aria-label={secondaryLabel}
        onClick={onSecondaryClick}
        className={cn(segmentBase, "px-2.5", styles.segment)}
      >
        <SecondaryIcon className="size-4" />
      </button>
    </span>
  );
}

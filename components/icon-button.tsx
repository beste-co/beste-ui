"use client";

import { Slot } from "@radix-ui/react-slot";
import type { IconSvgElement } from "@hugeicons/react";
import { HugeiconsIcon } from "@hugeicons/react";
import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "dark" | "primary";
type Size = "sm" | "md" | "lg";
type Rounded = "full" | "md";

interface IconButtonProps {
  /** Accessible name, required, since the button shows only an icon. */
  label: string;
  /** A hugeicons glyph, e.g. `ArrowLeft01Icon`. */
  icon: IconSvgElement;
  /**
   * Compose the rendered element shadcn-style (radix asChild): your element
   * (e.g. a router Link) becomes the root and the button content is injected
   * as its children. Pass the element without children of its own.
   */
  asChild?: boolean;
  children?: React.ReactElement;
  /** Fallback link. Prefer `asChild` with your framework's Link. */
  href?: string;
  tone?: Tone;
  size?: Size;
  rounded?: Rounded;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
}

const toneStyles: Record<Tone, string> = {
  neutral: "border bg-background text-foreground hover:bg-muted",
  dark: "bg-foreground text-background hover:bg-foreground/90",
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
};

const sizeStyles: Record<Size, { root: string; icon: number }> = {
  sm: { root: "size-8", icon: 16 },
  md: { root: "size-10", icon: 16 },
  lg: { root: "size-12", icon: 20 },
};

/**
 * The site's icon-only button: `button4` from the registry, drawn with
 * hugeicons.
 *
 * A copy rather than an edit. `button4` is a catalogue asset that ships to
 * projects with lucide, and it types its `icon` prop as a lucide component — a
 * hugeicons glyph is data, not a component, so the two cannot be the same file.
 * Everything else is the block's, down to the hover scale, so the two stay
 * indistinguishable on screen.
 */
export function IconButton({
  label,
  icon,
  asChild = false,
  children,
  href,
  tone = "neutral",
  size = "md",
  rounded = "full",
  onClick,
  className,
}: IconButtonProps) {
  const sizes = sizeStyles[size];

  const classes = cn(
    "group/icon-button inline-flex shrink-0 cursor-pointer items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    rounded === "full" ? "rounded-full" : "rounded-md",
    sizes.root,
    toneStyles[tone],
    className
  );

  const inner = (
    <HugeiconsIcon
      icon={icon}
      size={sizes.icon}
      strokeWidth={2}
      aria-hidden="true"
      className="transition-transform duration-200 ease-out motion-safe:group-hover/icon-button:scale-110"
    />
  );

  if (asChild && React.isValidElement(children)) {
    return (
      <Slot aria-label={label} title={label} className={classes}>
        {React.cloneElement(children, undefined, inner)}
      </Slot>
    );
  }

  if (href) {
    return (
      <a href={href} aria-label={label} title={label} className={classes}>
        {inner}
      </a>
    );
  }

  return (
    <button type="button" aria-label={label} title={label} onClick={onClick} className={classes}>
      {inner}
    </button>
  );
}

"use client";

import { ArrowRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Tone = "light" | "outline" | "dark" | "primary";
type Direction = "up-right" | "right";
type Size = "default" | "sm";

interface Button23Props {
  /** Button label, in sentence case */
  label: string;
  /**
   * Compose the rendered element shadcn-style (radix asChild): your element
   * (e.g. a router Link) becomes the root and the button content is injected
   * as its children. Pass the element without children of its own.
   */
  asChild?: boolean;
  /** The element to render when `asChild` is set (e.g. your framework's Link) */
  children?: React.ReactElement;
  /** Fallback link: renders a plain `<a>`. Prefer `asChild` with your framework's Link. */
  href?: string;
  /** Which way the arrow points and travels on hover; also picks the default icon */
  direction?: Direction;
  /** Icon at the end of the pill; defaults to the arrow for `direction` */
  icon?: LucideIcon;
  /** White pill for dark or photographic surfaces (stays white in both themes), a hairline outline in the current text color, a dark pill for light pages, or the accent */
  tone?: Tone;
  /** Pill size: the default one, or a compact one for dense layouts */
  size?: Size;
  /** Click handler (used when there is no href and no asChild) */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  /** Additional classes merged onto the button */
  className?: string;
}

const toneStyles: Record<Tone, string> = {
  light: "bg-white text-neutral-950 hover:bg-white/85",
  // text-current keeps the label on the surface color and strips the base variant's text-primary-foreground
  outline: "border border-current/25 bg-transparent text-current hover:border-current/60 hover:bg-transparent",
  dark: "bg-foreground text-background hover:bg-foreground/85",
  primary: "bg-primary text-primary-foreground hover:bg-primary/85",
};

export const button23Demo: Button23Props = {
  label: "Enter the studio",
  tone: "dark",
};

const sizeStyles: Record<Size, string> = {
  default: "h-12 gap-3 px-6 text-base",
  sm: "h-9 gap-2 px-4 text-sm",
};

const easing = "duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]";

// Leaving arrow and arriving twin for each direction; the twin waits on the opposite side
const travel: Record<Direction, { out: string; in: string }> = {
  "up-right": {
    out: "group-hover/button23:-translate-y-4 group-hover/button23:translate-x-4",
    in: "-translate-x-4 translate-y-4 group-hover/button23:translate-x-0 group-hover/button23:translate-y-0",
  },
  right: {
    out: "group-hover/button23:translate-x-4",
    in: "-translate-x-4 group-hover/button23:translate-x-0",
  },
};

export function Button23({ label, asChild = false, children, href, direction = "up-right", icon, tone = "light", size = "default", onClick, className }: Button23Props) {
  const Icon = icon ?? (direction === "right" ? ArrowRight : ArrowUpRight);
  const classes = cn(
    "group/button23 w-fit cursor-pointer rounded-full font-normal shadow-none transition-colors duration-500",
    sizeStyles[size],
    toneStyles[tone],
    className
  );

  // The arrow leaves the way it points while a twin arrives from behind it
  const inner = (
    <>
      <span>{label}</span>
      <span aria-hidden="true" className="relative size-4 shrink-0 overflow-hidden">
        <Icon className={cn("absolute inset-0 size-4 transition-transform", travel[direction].out, easing)} />
        <Icon className={cn("absolute inset-0 size-4 transition-transform", travel[direction].in, easing)} />
      </span>
    </>
  );

  if (asChild && React.isValidElement(children)) {
    return (
      <Button asChild className={classes}>
        {React.cloneElement(children, undefined, inner)}
      </Button>
    );
  }

  if (href) {
    return (
      <Button asChild className={classes}>
        <a href={href}>{inner}</a>
      </Button>
    );
  }

  return (
    <Button type="button" className={classes} onClick={onClick}>
      {inner}
    </Button>
  );
}

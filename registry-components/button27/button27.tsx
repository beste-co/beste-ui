"use client";

import type { LucideIcon } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Tone = "primary" | "outline" | "soft" | "inverse" | "ghost" | "ink";
type Size = "sm" | "default";

interface Button27Props {
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
  /** Optional icon after the label */
  icon?: LucideIcon;
  /** The ink pill, a hairline outline on the card color, a frosted pill for photos, the reversed pill for ink panels, a hairline in the current text color, or a fixed dark pill for light pictures in any theme */
  tone?: Tone;
  /** Pill height: compact for bars, or the default one for heroes and calls to action */
  size?: Size;
  /** Submit a surrounding form instead of acting as a plain button */
  type?: "button" | "submit";
  /** Click handler (used when there is no href and no asChild) */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  /** Additional classes merged onto the button */
  className?: string;
}

const toneStyles: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/85",
  outline: "border border-input bg-card text-card-foreground hover:bg-muted",
  soft: "bg-card/85 text-card-foreground backdrop-blur-sm hover:bg-card",
  inverse: "bg-primary-foreground text-primary hover:bg-primary-foreground/90",
  // text-current keeps the label on the surface color, so one tone serves light and dark panels
  ghost: "border border-current/40 bg-transparent text-current hover:border-current/70 hover:bg-current/5",
  // Light gradients and photos do not follow the theme, so the pill on them keeps a fixed ink
  ink: "bg-neutral-950 text-white hover:bg-neutral-800",
};

const sizeStyles: Record<Size, string> = {
  sm: "h-9.5 gap-2 px-4 text-sm",
  default: "h-12 gap-2 px-5.5 text-base",
};

export const button27Demo: Button27Props = {
  label: "Start free",
  tone: "primary",
};

export function Button27({
  label,
  asChild = false,
  children,
  href,
  icon: Icon,
  tone = "primary",
  size = "default",
  type = "button",
  onClick,
  className,
}: Button27Props) {
  const classes = cn("w-fit cursor-pointer rounded-full font-normal shadow-none transition-colors duration-200", sizeStyles[size], toneStyles[tone], className);

  const inner = (
    <>
      <span>{label}</span>
      {Icon && <Icon className="size-4 shrink-0" />}
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
    <Button type={type} className={classes} onClick={onClick}>
      {inner}
    </Button>
  );
}

"use client";

import type { LucideIcon } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Tone = "secondary" | "primary" | "outline" | "glass";
type Size = "sm" | "default" | "lg";

interface Button26Props {
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
  /** Optional icon; after the label it nudges forward on hover */
  icon?: LucideIcon;
  /** Which side of the label the icon sits on */
  iconPosition?: "start" | "end";
  /** The bright secondary fill, the primary fill, a hairline outline in the current text color, or a frosted pill for dark surfaces */
  tone?: Tone;
  /** Pill height: compact for bars, default, or large for heroes */
  size?: Size;
  /** Submit a surrounding form instead of acting as a plain button */
  type?: "button" | "submit";
  /** Click handler (used when there is no href and no asChild) */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  /** Additional classes merged onto the button */
  className?: string;
}

const toneStyles: Record<Tone, string> = {
  secondary: "bg-secondary font-bold text-secondary-foreground hover:bg-secondary/90 hover:shadow-lg",
  primary: "bg-primary font-semibold text-primary-foreground hover:bg-primary/90 hover:shadow-lg",
  // text-current keeps the label on the surface color, so one tone serves light and dark grounds
  outline: "border border-current/25 bg-transparent font-semibold text-current hover:border-current/50 hover:bg-current/5",
  glass: "border border-current/30 bg-current/10 font-semibold text-current hover:border-current/60 hover:bg-current/15",
};

// The has-[>svg] twins override the base Button's tighter padding for icon buttons
const sizeStyles: Record<Size, string> = {
  sm: "h-11 gap-2 px-6 text-sm has-[>svg]:px-6",
  default: "h-12 gap-2.5 px-7 text-base has-[>svg]:px-7",
  lg: "h-14 gap-2.5 px-8 text-base has-[>svg]:px-8",
};

export const button26Demo: Button26Props = {
  label: "Start free",
  tone: "secondary",
  size: "lg",
};

export function Button26({
  label,
  asChild = false,
  children,
  href,
  icon: Icon,
  iconPosition = "end",
  tone = "secondary",
  size = "default",
  type = "button",
  onClick,
  className,
}: Button26Props) {
  const classes = cn(
    "group/button26 w-fit cursor-pointer rounded-full shadow-none transition-all duration-300 motion-safe:hover:-translate-y-0.5",
    sizeStyles[size],
    toneStyles[tone],
    className,
  );

  const icon = Icon && (
    <Icon
      className={cn(
        "size-4 shrink-0 transition-transform duration-300",
        iconPosition === "end" && "motion-safe:group-hover/button26:translate-x-1",
      )}
    />
  );

  const inner = (
    <>
      {iconPosition === "start" && icon}
      <span>{label}</span>
      {iconPosition === "end" && icon}
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

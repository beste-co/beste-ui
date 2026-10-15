"use client";

import type { LucideIcon } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Tone = "dark" | "outline" | "primary" | "neutral";
type Size = "default" | "sm";

interface Button25Props {
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
  /** Optional icon after the label; it nudges to the right on hover */
  icon?: LucideIcon;
  /** A dark pill for light pages, a hairline outline in the current text color, the accent, or a paper pill for dark and photographic surfaces */
  tone?: Tone;
  /** Pill size: the default one, or a compact one for dense rows */
  size?: Size;
  /** Submit a surrounding form instead of acting as a plain button */
  type?: "button" | "submit";
  /** Click handler (used when there is no href and no asChild) */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  /** Additional classes merged onto the button */
  className?: string;
}

const toneStyles: Record<Tone, string> = {
  dark: "bg-foreground text-background hover:bg-foreground/85",
  // text-current keeps the label on the surface color and strips the base variant's text-primary-foreground
  outline: "border border-current/25 bg-transparent text-current hover:border-current/60 hover:bg-transparent",
  primary: "bg-primary text-primary-foreground hover:bg-primary/85",
  neutral: "bg-background text-foreground hover:bg-background/85",
};

const sizeStyles: Record<Size, string> = {
  default: "h-12 gap-3 px-6 text-base",
  sm: "h-10 gap-2 px-5 text-sm",
};

export const button25Demo: Button25Props = {
  label: "Register your interest",
  tone: "dark",
};

export function Button25({ label, asChild = false, children, href, icon: Icon, tone = "dark", size = "default", type = "button", onClick, className }: Button25Props) {
  const classes = cn("group/button25 w-fit cursor-pointer rounded-full font-normal shadow-none transition-colors duration-500", sizeStyles[size], toneStyles[tone], className);

  const inner = (
    <>
      <span>{label}</span>
      {Icon && <Icon className="size-4 shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/button25:translate-x-0.5" />}
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

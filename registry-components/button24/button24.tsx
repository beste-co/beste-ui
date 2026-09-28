"use client";

import { ArrowDownRight, type LucideIcon } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Tone = "dark" | "primary" | "light";

interface Button24Props {
  /** Button label */
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
  /** Icon that turns on hover; a down-right arrow that swings to point right when omitted */
  icon?: LucideIcon;
  /** Dark block that turns to the accent on hover (default), accent block that turns dark, or a light block that turns to the accent */
  tone?: Tone;
  /** Click handler (used when there is no href and no asChild) */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  /** Additional classes merged onto the button */
  className?: string;
}

const toneStyles: Record<Tone, string> = {
  dark: "bg-foreground text-background hover:bg-primary hover:text-primary-foreground",
  primary: "bg-primary text-primary-foreground hover:bg-foreground hover:text-background",
  light: "bg-background text-foreground hover:bg-primary hover:text-primary-foreground",
};

export const button24Demo: Button24Props = {
  label: "Get a festival pass",
};

export function Button24({ label, asChild = false, children, href, icon: Icon = ArrowDownRight, tone = "dark", onClick, className }: Button24Props) {
  const classes = cn(
    "group/button24 h-14 w-fit cursor-pointer gap-4 rounded-none px-6 text-lg font-medium shadow-none transition-colors duration-300",
    toneStyles[tone],
    className
  );

  // The arrow swings a quarter turn toward the reader's next step
  const inner = (
    <>
      <span>{label}</span>
      <Icon aria-hidden="true" className="size-5 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/button24:-rotate-45" />
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

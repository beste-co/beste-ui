"use client";

import type { LucideIcon } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Tone = "primary" | "neutral" | "outline";

interface Button21Props {
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
  /**
   * Fallback link: renders a plain `<a>`. Prefer `asChild` with your
   * framework's Link component for client-side navigation.
   */
  href?: string;
  /** Optional trailing icon */
  icon?: LucideIcon;
  /** Surface tone: solid accent (default), soft neutral pill, or hairline outline */
  tone?: Tone;
  /** Click handler (used when there is no href and no asChild) */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  /** Additional classes merged onto the button */
  className?: string;
}

const toneStyles: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
  neutral: "bg-muted text-foreground hover:bg-muted/70",
  outline: "border border-border bg-transparent text-foreground hover:bg-muted",
};

export const button21Demo: Button21Props = {
  label: "Book a demo",
};

export function Button21({
  label,
  asChild = false,
  children,
  href,
  icon: Icon,
  tone = "primary",
  onClick,
  className,
}: Button21Props) {
  const classes = cn(
    "group/button21 h-auto w-fit gap-2 rounded-md px-5 py-2.5 text-sm font-medium tracking-tight transition-colors",
    toneStyles[tone],
    className
  );

  const inner = (
    <>
      {label}
      {Icon && (
        <Icon className="size-4 transition-transform motion-safe:group-hover/button21:translate-x-0.5" />
      )}
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

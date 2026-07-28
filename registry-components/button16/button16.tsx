"use client";

import { Slot } from "@radix-ui/react-slot";
import type { LucideIcon } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "dark" | "primary";
type Rounded = "full" | "lg" | "md" | "none";

const roundedStyles: Record<Rounded, string> = {
  full: "rounded-full",
  lg: "rounded-lg",
  md: "rounded-md",
  none: "rounded-none",
};

interface Button16Props {
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
  /** Optional leading icon */
  icon?: LucideIcon;
  /** Surface tone: solid dark (default) or primary */
  tone?: Tone;
  /** Corner radius (defaults to full) */
  rounded?: Rounded;
  /** Click handler (used when there is no href and no asChild) */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  /** Additional classes merged onto the button */
  className?: string;
}

const toneStyles: Record<Tone, string> = {
  dark: "bg-foreground text-background hover:bg-foreground/90",
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
};

export const button16Demo: Button16Props = {
  label: "Upgrade to Pro",
};

export function Button16({
  label,
  asChild = false,
  children,
  href,
  icon: Icon,
  tone = "dark",
  rounded = "full",
  onClick,
  className,
}: Button16Props) {
  const classes = cn(
    "group/button16 relative inline-flex w-fit cursor-pointer items-center gap-2 overflow-hidden px-7 py-3 text-base font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    roundedStyles[rounded],
    toneStyles[tone],
    className
  );

  const inner = (
    <>
      {/* Diagonal glare bar: parked off the left edge, sweeps across on hover */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -translate-x-full -skew-x-12 bg-white/25 blur-sm transition-transform duration-700 ease-out motion-safe:group-hover/button16:translate-x-[400%]"
      />
      {Icon && <Icon className="relative size-4 shrink-0" />}
      <span className="relative">{label}</span>
    </>
  );

  if (asChild && React.isValidElement(children)) {
    return (
      <Slot className={classes}>
        {React.cloneElement(children, undefined, inner)}
      </Slot>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes}>
        {inner}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes}>
      {inner}
    </button>
  );
}

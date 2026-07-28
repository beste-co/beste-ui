"use client";

import { Slot } from "@radix-ui/react-slot";
import { ArrowUpRight, type LucideIcon } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "dark" | "primary";
type Size = "sm" | "md" | "lg";
type Rounded = "full" | "md";

interface Button4Props {
  /** Accessible name, required, since the button shows only an icon */
  label: string;
  /**
   * Compose the rendered element shadcn-style (radix asChild): your element
   * (e.g. a router Link) becomes the root and the button content is injected
   * as its children. Pass the element without children of its own.
   */
  asChild?: boolean;
  /** The element to render when `asChild` is set (e.g. your framework's Link) */
  children?: React.ReactElement;
  /** The icon (defaults to ArrowUpRight) */
  icon?: LucideIcon;
  /**
   * Fallback link: renders a plain `<a>`. Prefer `asChild` with your
   * framework's Link component for client-side navigation.
   */
  href?: string;
  /** Surface tone: bordered background (default), solid dark, or primary */
  tone?: Tone;
  /** Button size */
  size?: Size;
  /** Circle (default) or rounded square */
  rounded?: Rounded;
  /** Click handler (used when there is no href and no asChild) */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  /** Additional classes merged onto the button */
  className?: string;
}

const toneStyles: Record<Tone, string> = {
  neutral: "border bg-background text-foreground hover:bg-muted",
  dark: "bg-foreground text-background hover:bg-foreground/90",
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
};

const sizeStyles: Record<Size, { root: string; icon: string }> = {
  sm: { root: "size-8", icon: "size-4" },
  md: { root: "size-10", icon: "size-4" },
  lg: { root: "size-12", icon: "size-5" },
};

export const button4Demo: Button4Props = {
  label: "Open case study",
};

/**
 * Icon-only button done right: the label prop is mandatory and becomes the
 * accessible name (aria-label + title), so it never ships as an unnamed
 * button. The icon scales up subtly on hover.
 */
export function Button4({
  label,
  asChild = false,
  children,
  icon: Icon = ArrowUpRight,
  href,
  tone = "neutral",
  size = "md",
  rounded = "full",
  onClick,
  className,
}: Button4Props) {
  const sizes = sizeStyles[size];

  const classes = cn(
    "group/button4 inline-flex shrink-0 cursor-pointer items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    rounded === "full" ? "rounded-full" : "rounded-md",
    sizes.root,
    toneStyles[tone],
    className
  );

  const inner = (
    <Icon
      aria-hidden="true"
      className={cn(
        "transition-transform duration-200 ease-out motion-safe:group-hover/button4:scale-110",
        sizes.icon
      )}
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

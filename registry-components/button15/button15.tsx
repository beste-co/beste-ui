"use client";

import { Slot } from "@radix-ui/react-slot";
import { ArrowRight, type LucideIcon } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "dark" | "primary" | "outline";
type Rounded = "full" | "lg" | "md" | "none";

const roundedStyles: Record<Rounded, string> = {
  full: "rounded-full",
  lg: "rounded-lg",
  md: "rounded-md",
  none: "rounded-none",
};

interface Button15Props {
  /** Button label, revealed as the pill expands on hover/focus */
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
  /** Seal icon (defaults to ArrowRight) */
  icon?: LucideIcon;
  /** Surface tone: solid dark (default), primary, or bordered outline */
  tone?: Tone;
  /** Corner radius, mirrored onto the seal (defaults to full) */
  rounded?: Rounded;
  /** Click handler (used when there is no href and no asChild) */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  /** Additional classes merged onto the button */
  className?: string;
}

const toneStyles: Record<Tone, { root: string; seal: string }> = {
  dark: {
    root: "bg-foreground text-background",
    seal: "bg-background text-foreground",
  },
  primary: {
    root: "bg-primary text-primary-foreground",
    seal: "bg-primary-foreground text-primary",
  },
  outline: {
    root: "border border-foreground/20 bg-background text-foreground hover:border-foreground/40",
    seal: "bg-foreground text-background",
  },
};

export const button15Demo: Button15Props = {
  label: "Get in touch",
};

/**
 * Collapsed, the button is a compact circular seal. Hovering (or keyboard
 * focus) expands the pill and reveals the label. The label stays in the DOM
 * while collapsed, so screen readers always announce it.
 */
export function Button15({
  label,
  asChild = false,
  children,
  href,
  icon: Icon = ArrowRight,
  tone = "dark",
  rounded = "full",
  onClick,
  className,
}: Button15Props) {
  const styles = toneStyles[tone];

  const classes = cn(
    "group/button15 inline-flex w-fit cursor-pointer items-center p-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    roundedStyles[rounded],
    styles.root,
    className
  );

  const reveal =
    "group-hover/button15:max-w-64 group-hover/button15:pl-3 group-hover/button15:pr-4 group-hover/button15:opacity-100 " +
    "group-focus-visible/button15:max-w-64 group-focus-visible/button15:pl-3 group-focus-visible/button15:pr-4 group-focus-visible/button15:opacity-100";

  const inner = (
    <>
      <span
        className={cn(
          "flex size-10 shrink-0 items-center justify-center",
          roundedStyles[rounded],
          styles.seal
        )}
      >
        <Icon className="size-4" />
      </span>
      {/* Expansion is a state change, not decoration, under reduced motion it
          still opens, just without the tween. */}
      <span
        className={cn(
          "max-w-0 overflow-hidden whitespace-nowrap text-base font-semibold opacity-0 transition-[max-width,padding,opacity] duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] motion-reduce:transition-none",
          reveal
        )}
      >
        {label}
      </span>
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

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

interface Button13Props {
  /** Button label (animated letter by letter on hover) */
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
  /** Trailing icon (defaults to ArrowRight); pass null-like hide via showIcon */
  icon?: LucideIcon;
  /** Hide the trailing icon */
  hideIcon?: boolean;
  /** Surface tone: solid dark (default), primary, or bordered outline */
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
  outline: "border border-foreground/20 bg-background text-foreground hover:border-foreground/40",
};

/** Per-letter stagger; capped so long labels don't take forever to finish. */
const STEP_MS = 22;
const MAX_DELAY_MS = 440;

export const button13Demo: Button13Props = {
  label: "Start your project",
};

export function Button13({
  label,
  asChild = false,
  children,
  href,
  icon: Icon = ArrowRight,
  hideIcon = false,
  tone = "dark",
  rounded = "full",
  onClick,
  className,
}: Button13Props) {
  const letters = label.split("");
  const delay = (i: number) => `${Math.min(i * STEP_MS, MAX_DELAY_MS)}ms`;

  const classes = cn(
    "group/button13 inline-flex w-fit cursor-pointer items-center gap-2.5 px-7 py-3 text-base font-semibold tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    roundedStyles[rounded],
    toneStyles[tone],
    className
  );

  const inner = (
    <>
      {/* Both letter rows are decorative; the sr-only span carries the label. */}
      <span className="sr-only">{label}</span>
      <span aria-hidden="true" className="relative block overflow-hidden whitespace-nowrap">
        <span className="block">
          {letters.map((ch, i) => (
            <span
              key={`out-${i}-${ch}`}
              className="inline-block transition-transform duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] motion-safe:group-hover/button13:-translate-y-[110%]"
              style={{ transitionDelay: delay(i) }}
            >
              {ch === " " ? "\u00A0" : ch}
            </span>
          ))}
        </span>
        <span className="absolute inset-0 block">
          {letters.map((ch, i) => (
            <span
              key={`in-${i}-${ch}`}
              className="inline-block translate-y-[110%] transition-transform duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] motion-safe:group-hover/button13:translate-y-0"
              style={{ transitionDelay: delay(i) }}
            >
              {ch === " " ? "\u00A0" : ch}
            </span>
          ))}
        </span>
      </span>
      {!hideIcon && (
        <Icon className="size-4 shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] motion-safe:group-hover/button13:translate-x-1" />
      )}
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

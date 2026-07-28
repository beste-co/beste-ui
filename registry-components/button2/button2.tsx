"use client";

import { Slot } from "@radix-ui/react-slot";
import { ArrowRight, type LucideIcon } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "foreground" | "muted" | "primary";

interface Button2Props {
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
  /** Trailing icon (defaults to ArrowRight) */
  icon?: LucideIcon;
  /** Hide the trailing icon */
  hideIcon?: boolean;
  /** Text color: foreground (default), muted, or primary */
  tone?: Tone;
  /** Click handler (used when there is no href and no asChild) */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  /** Additional classes merged onto the button */
  className?: string;
}

const toneStyles: Record<Tone, string> = {
  foreground: "text-foreground",
  muted: "text-muted-foreground hover:text-foreground",
  primary: "text-primary",
};

export const button2Demo: Button2Props = {
  label: "View all case studies",
};

/**
 * The lightest CTA in the set: plain text with an underline that draws in
 * from the left on hover and sweeps out to the right on exit.
 */
export function Button2({
  label,
  asChild = false,
  children,
  href,
  icon: Icon = ArrowRight,
  hideIcon = false,
  tone = "foreground",
  onClick,
  className,
}: Button2Props) {
  const classes = cn(
    "group/button2 inline-flex w-fit cursor-pointer items-center gap-1.5 rounded-sm text-base font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4",
    toneStyles[tone],
    className
  );

  const inner = (
    <>
      <span className="relative">
        {label}
        {/* Draws from the left on hover, exits to the right on leave. Under
            reduced motion it still appears, just without the tween. */}
        <span
          aria-hidden="true"
          className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-current transition-transform duration-300 ease-out group-hover/button2:origin-left group-hover/button2:scale-x-100 motion-reduce:transition-none"
        />
      </span>
      {!hideIcon && (
        <Icon className="size-4 shrink-0 transition-transform duration-300 ease-out motion-safe:group-hover/button2:translate-x-1" />
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

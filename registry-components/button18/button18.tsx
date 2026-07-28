"use client";

import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "foreground" | "primary" | "muted";

interface Button18Props {
  /** Button label (rendered uppercase, monospace) */
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
  /** Text and bracket color */
  tone?: Tone;
  /** Click handler (used when there is no href and no asChild) */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  /** Additional classes merged onto the button */
  className?: string;
}

const toneStyles: Record<Tone, string> = {
  foreground: "text-foreground",
  primary: "text-primary",
  muted: "text-muted-foreground hover:text-foreground",
};

const cornerBase =
  "absolute size-2.5 border-current transition-transform duration-300 ease-out";

export const button18Demo: Button18Props = {
  label: "View manifest",
};

/**
 * A technical, monospace CTA framed by four corner brackets that spring
 * outward on hover, the button equivalent of the parenthetical eyebrow.
 */
export function Button18({
  label,
  asChild = false,
  children,
  href,
  tone = "foreground",
  onClick,
  className,
}: Button18Props) {
  const classes = cn(
    "group/button18 relative inline-flex w-fit cursor-pointer items-center px-6 py-3 font-mono text-base uppercase tracking-widest transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4",
    toneStyles[tone],
    className
  );

  const inner = (
    <>
      <span
        aria-hidden="true"
        className={cn(
          cornerBase,
          "left-0 top-0 border-l border-t motion-safe:group-hover/button18:-translate-x-1 motion-safe:group-hover/button18:-translate-y-1"
        )}
      />
      <span
        aria-hidden="true"
        className={cn(
          cornerBase,
          "right-0 top-0 border-r border-t motion-safe:group-hover/button18:translate-x-1 motion-safe:group-hover/button18:-translate-y-1"
        )}
      />
      <span
        aria-hidden="true"
        className={cn(
          cornerBase,
          "bottom-0 left-0 border-b border-l motion-safe:group-hover/button18:-translate-x-1 motion-safe:group-hover/button18:translate-y-1"
        )}
      />
      <span
        aria-hidden="true"
        className={cn(
          cornerBase,
          "bottom-0 right-0 border-b border-r motion-safe:group-hover/button18:translate-x-1 motion-safe:group-hover/button18:translate-y-1"
        )}
      />
      {label}
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

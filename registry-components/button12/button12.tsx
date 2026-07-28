"use client";

import { Slot } from "@radix-ui/react-slot";
import { ArrowUpRight, type LucideIcon } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "dark" | "primary" | "outline";

interface Button12Props {
  /** Button label (rendered uppercase) */
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
  /** Seal icon (defaults to ArrowUpRight) */
  icon?: LucideIcon;
  /** Surface tone: solid dark (default), solid primary, or bordered outline */
  tone?: Tone;
  /** Click handler (used when there is no href and no asChild) */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  /** Additional classes merged onto the button */
  className?: string;
}

const toneStyles: Record<Tone, { pill: string; seal: string }> = {
  dark: {
    pill: "bg-foreground text-background hover:bg-foreground/90",
    seal: "bg-background text-foreground",
  },
  primary: {
    pill: "bg-primary text-primary-foreground hover:bg-primary/90",
    seal: "bg-primary-foreground text-primary",
  },
  outline: {
    pill: "border bg-background text-foreground hover:bg-muted",
    seal: "bg-foreground text-background",
  },
};

export const button12Demo: Button12Props = {
  label: "Book an intro call",
};

export function Button12({
  label,
  asChild = false,
  children,
  href,
  icon: Icon = ArrowUpRight,
  tone = "dark",
  onClick,
  className,
}: Button12Props) {
  const styles = toneStyles[tone];

  const classes = cn(
    "group/button12 inline-flex w-fit cursor-pointer items-center gap-3 rounded-full py-2 pl-8 pr-2 text-base font-bold uppercase tracking-wider transition-colors",
    styles.pill,
    className
  );

  const inner = (
    <>
      {/* Label slides out the bottom while a copy drops in from the top */}
      <span className="relative block overflow-hidden">
        <span className="block transition-transform duration-300 ease-out motion-safe:group-hover/button12:translate-y-full">
          {label}
        </span>
        <span
          aria-hidden="true"
          className="absolute inset-0 block -translate-y-full transition-transform duration-300 ease-out motion-safe:group-hover/button12:translate-y-0"
        >
          {label}
        </span>
      </span>

      {/* Seal: icon exits the top-right corner as a copy enters from bottom-left */}
      <span
        className={cn(
          "relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full",
          styles.seal
        )}
      >
        <Icon className="size-4 transition-transform duration-300 ease-out motion-safe:group-hover/button12:translate-x-[160%] motion-safe:group-hover/button12:-translate-y-[160%]" />
        <Icon
          aria-hidden="true"
          className="absolute size-4 -translate-x-[160%] translate-y-[160%] transition-transform duration-300 ease-out motion-safe:group-hover/button12:translate-x-0 motion-safe:group-hover/button12:translate-y-0"
        />
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

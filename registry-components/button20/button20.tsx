"use client";

import { Slot } from "@radix-ui/react-slot";
import type { LucideIcon } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "dark" | "primary";

interface Button20Props {
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
  /** How strongly the button follows the cursor (0–1, defaults to 0.25) */
  strength?: number;
  /** Click handler (used when there is no href and no asChild) */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  /** Additional classes merged onto the button */
  className?: string;
}

const toneStyles: Record<Tone, string> = {
  dark: "bg-foreground text-background hover:bg-foreground/90",
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
};

export const button20Demo: Button20Props = {
  label: "Let's talk",
};

/**
 * The awwwards-style magnetic CTA: while the cursor is over the button it is
 * gently pulled toward it, then springs back on leave. Pointer-only by
 * nature (touch and keyboard are unaffected) and disabled entirely under
 * prefers-reduced-motion.
 */
export function Button20({
  label,
  asChild = false,
  children,
  href,
  icon: Icon,
  tone = "dark",
  strength = 0.25,
  onClick,
  className,
}: Button20Props) {
  const handleMove = (event: React.MouseEvent<HTMLElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = event.currentTarget;
    const rect = el.getBoundingClientRect();
    const dx = (event.clientX - rect.left - rect.width / 2) * strength;
    const dy = (event.clientY - rect.top - rect.height / 2) * strength;
    el.style.transform = `translate(${dx}px, ${dy}px)`;
  };

  const handleLeave = (event: React.MouseEvent<HTMLElement>) => {
    event.currentTarget.style.transform = "";
  };

  const classes = cn(
    "inline-flex w-fit cursor-pointer items-center gap-2 rounded-full px-8 py-3.5 text-base font-semibold transition-[transform,background-color] duration-300 ease-out will-change-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    toneStyles[tone],
    className
  );

  const inner = (
    <>
      {Icon && <Icon className="size-4 shrink-0" />}
      {label}
    </>
  );

  if (asChild && React.isValidElement(children)) {
    return (
      <Slot className={classes} onMouseMove={handleMove} onMouseLeave={handleLeave}>
        {React.cloneElement(children, undefined, inner)}
      </Slot>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
      >
        {inner}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={classes}
    >
      {inner}
    </button>
  );
}

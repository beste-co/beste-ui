"use client";

import { Slot } from "@radix-ui/react-slot";
import type { LucideIcon } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "primary";

interface Button11Props {
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
  /** Surface tone: plain background (default) or primary fill. The hard border and shadow stay foreground either way */
  tone?: Tone;
  /** Click handler (used when there is no href and no asChild) */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  /** Additional classes merged onto the button */
  className?: string;
}

const toneStyles: Record<Tone, string> = {
  neutral: "bg-background text-foreground",
  primary: "bg-primary text-primary-foreground",
};

export const button11Demo: Button11Props = {
  label: "Press me",
};

export function Button11({
  label,
  asChild = false,
  children,
  href,
  icon: Icon,
  tone = "neutral",
  onClick,
  className,
}: Button11Props) {
  const classes = cn(
    "inline-flex w-fit cursor-pointer items-center gap-2 rounded-md border-2 border-foreground px-6 py-2.5 text-base font-bold shadow-[4px_4px_0_0_var(--foreground)] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_var(--foreground)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_0_var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    toneStyles[tone],
    className
  );

  const inner = (
    <>
      {Icon && <Icon className="size-4" />}
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

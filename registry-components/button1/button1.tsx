"use client";

import { ArrowRight, type LucideIcon } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Tone = "dark" | "primary";

interface Button1Props {
  /** Button label (rendered uppercase) */
  label: string;
  /**
   * Compose the rendered element shadcn-style (radix asChild):
   * `<Button1 asChild label="Read More"><Link href="/x" /></Button1>`
   * The child element receives the pill content (label + seal) as its
   * children, so pass it without children of its own.
   */
  asChild?: boolean;
  /** The element to render when `asChild` is set (e.g. your router's Link) */
  children?: React.ReactElement;
  /**
   * Fallback link: renders a plain `<a>`. Prefer `asChild` with your
   * framework's Link component for client-side navigation.
   */
  href?: string;
  /** Trailing seal icon (defaults to ArrowRight) */
  icon?: LucideIcon;
  /** Surface tone: dark pill (default) or primary pill (for dark backgrounds) */
  tone?: Tone;
  /** Fully round the pill and seal (shorthand for className="rounded-full") */
  roundedFull?: boolean;
  /** Click handler (used when there is no href and no asChild) */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  /** Additional classes merged onto the button */
  className?: string;
}

const toneStyles: Record<Tone, { pill: string; seal: string }> = {
  dark: {
    pill: "bg-foreground text-background hover:bg-foreground/90",
    seal: "bg-primary text-primary-foreground",
  },
  primary: {
    pill: "bg-primary text-primary-foreground hover:bg-primary/90",
    seal: "bg-primary-foreground text-primary",
  },
};

export const button1Demo: Button1Props = {
  label: "Read More",
};

export function Button1({
  label,
  asChild = false,
  children,
  href,
  icon: Icon = ArrowRight,
  tone = "dark",
  roundedFull = false,
  onClick,
  className,
}: Button1Props) {
  const styles = toneStyles[tone];

  // Mirror the pill's border radius onto the seal so the arrow chip always
  // matches the pill. Priority: an explicit `rounded-*` in className wins,
  // then the `roundedFull` shorthand, otherwise the default rounded-md.
  const explicitRadius = className?.match(/\brounded-(?:none|sm|md|lg|xl|2xl|3xl|full)\b/)?.[0];
  const sealRadius = explicitRadius ?? (roundedFull ? "rounded-full" : "rounded-md");

  const inner = (
    <>
      {label}
      <span
        className={cn(
          "flex size-8 items-center justify-center transition-transform motion-safe:group-hover/button1:translate-x-0.5",
          sealRadius,
          styles.seal
        )}
      >
        <Icon className="size-4" />
      </span>
    </>
  );

  const classes = cn(
    // justify-between keeps the label left and the seal pinned right when the
    // pill is full-width; at w-fit there's no free space so they stay together.
    "group/button1 h-auto w-fit justify-between gap-3 rounded-md py-3 pl-6 pr-3 text-base font-bold uppercase tracking-wider transition-colors",
    roundedFull && "rounded-full",
    styles.pill,
    className
  );

  if (asChild && React.isValidElement(children)) {
    // The consumer's element (e.g. next/link's <Link href>) becomes the
    // rendered element; the pill content is injected as its children.
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

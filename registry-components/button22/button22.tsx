"use client";

import type { LucideIcon } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Tone = "primary" | "light" | "dark" | "outline";

interface Button22Props {
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
  /** Marker drawn at the end of the pill; a small dot when omitted */
  icon?: LucideIcon;
  /** Accent pill (default), light pill for photographic surfaces, dark pill for light pages, or a hairline outline in the current text colour */
  tone?: Tone;
  /** Click handler (used when there is no href and no asChild) */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  /** Additional classes merged onto the button */
  className?: string;
}

const toneStyles: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
  light: "bg-background text-foreground hover:bg-background/90",
  dark: "bg-foreground text-background hover:bg-foreground/90",
  // text-current keeps the label inheriting the surface colour and strips the base variant's text-primary-foreground
  outline: "border border-current/30 bg-transparent text-current backdrop-blur-sm hover:bg-current/10",
};

export const button22Demo: Button22Props = {
  label: "Start your journey",
};

// Marker sits 28px from its edge; the label travels 24px so the resting left gap
// and the hovered right gap are both 28px.
const easing = "duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]";
const markerBase = cn(
  "absolute top-1/2 -translate-y-1/2 transition-[opacity,translate] will-change-[translate,opacity]",
  easing
);

function Marker({ icon: Icon, className }: { icon?: LucideIcon; className: string }) {
  return Icon ? (
    <Icon aria-hidden="true" className={cn(markerBase, "size-4", className)} />
  ) : (
    <span aria-hidden="true" className={cn(markerBase, "size-1.5 rounded-full bg-current", className)} />
  );
}

export function Button22({
  label,
  asChild = false,
  children,
  href,
  icon: Icon,
  tone = "primary",
  onClick,
  className,
}: Button22Props) {
  const classes = cn(
    "group/button22 relative h-auto w-fit cursor-pointer rounded-full pl-7 pr-13 py-4 text-sm font-semibold uppercase tracking-[0.18em] antialiased shadow-none transition-colors duration-500",
    toneStyles[tone],
    className
  );

  // The marker leaves on the right as the label slides over and a twin arrives on the left
  const inner = (
    <>
      <Marker
        icon={Icon}
        className="left-7 -translate-x-3 opacity-0 group-hover/button22:translate-x-0 group-hover/button22:opacity-100"
      />
      <span
        className={cn(
          "inline-block transition-transform will-change-transform group-hover/button22:translate-x-6",
          easing
        )}
      >
        {label}
      </span>
      <Marker
        icon={Icon}
        className="right-7 translate-x-0 opacity-100 group-hover/button22:translate-x-3 group-hover/button22:opacity-0"
      />
    </>
  );

  if (asChild && React.isValidElement(children)) {
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

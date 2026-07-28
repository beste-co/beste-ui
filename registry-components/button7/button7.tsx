"use client";

import { Slot } from "@radix-ui/react-slot";
import { Play } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "dark" | "primary" | "outline";

interface Button7Props {
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
  /** Muted second line (e.g. the video duration "2:31") */
  sublabel?: string;
  /**
   * Fallback link: renders a plain `<a>`. Prefer `asChild` with your
   * framework's Link component for client-side navigation.
   */
  href?: string;
  /** Surface tone: solid dark (default), primary, or bordered outline */
  tone?: Tone;
  /** Click handler (used when there is no href and no asChild) */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  /** Additional classes merged onto the button */
  className?: string;
}

const toneStyles: Record<Tone, { root: string; seal: string; sub: string }> = {
  dark: {
    root: "bg-foreground text-background hover:bg-foreground/90",
    seal: "bg-background text-foreground",
    sub: "text-background/60",
  },
  primary: {
    root: "bg-primary text-primary-foreground hover:bg-primary/90",
    seal: "bg-primary-foreground text-primary",
    sub: "text-primary-foreground/70",
  },
  outline: {
    root: "border bg-background text-foreground hover:bg-muted",
    seal: "bg-foreground text-background",
    sub: "text-muted-foreground",
  },
};

export const button7Demo: Button7Props = {
  label: "Watch showreel",
  sublabel: "2:31",
};

/**
 * A video play CTA in one cohesive pill: a contrasting play seal on the
 * left, label and optional duration on the right. The seal scales up
 * slightly on hover.
 */
export function Button7({
  label,
  asChild = false,
  children,
  sublabel,
  href,
  tone = "dark",
  onClick,
  className,
}: Button7Props) {
  const styles = toneStyles[tone];

  const classes = cn(
    "group/button7 inline-flex w-fit cursor-pointer items-center gap-3 rounded-full p-1.5 pr-6 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    styles.root,
    className
  );

  const inner = (
    <>
      <span
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-full transition-transform duration-300 ease-out motion-safe:group-hover/button7:scale-105",
          styles.seal
        )}
      >
        <Play className="ml-0.5 size-4 fill-current" aria-hidden="true" />
      </span>
      <span className="flex flex-col items-start text-left leading-tight">
        <span className="text-base font-semibold">{label}</span>
        {sublabel && <span className={cn("text-sm", styles.sub)}>{sublabel}</span>}
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

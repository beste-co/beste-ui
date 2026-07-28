"use client";

import { Slot } from "@radix-ui/react-slot";
import { ArrowRight } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "dark" | "primary" | "outline";

interface Button6Props {
  /** Button label (e.g. "Join 2,400+ members") */
  label: string;
  /**
   * Compose the rendered element shadcn-style (radix asChild): your element
   * (e.g. a router Link) becomes the root and the button content is injected
   * as its children. Pass the element without children of its own.
   */
  asChild?: boolean;
  /** The element to render when `asChild` is set (e.g. your framework's Link) */
  children?: React.ReactElement;
  /** Avatar image URLs shown as a stack inside the pill */
  avatars: string[];
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

const toneStyles: Record<Tone, { root: string; ring: string }> = {
  dark: {
    root: "bg-foreground text-background hover:bg-foreground/90",
    ring: "border-foreground",
  },
  primary: {
    root: "bg-primary text-primary-foreground hover:bg-primary/90",
    ring: "border-primary",
  },
  outline: {
    root: "border bg-background text-foreground hover:bg-muted",
    ring: "border-background",
  },
};

export const button6Demo: Button6Props = {
  label: "Join 2,400+ members",
  avatars: [
    "https://i.pravatar.cc/64?img=14",
    "https://i.pravatar.cc/64?img=33",
    "https://i.pravatar.cc/64?img=48",
  ],
};

/**
 * A social-proof CTA: the avatar stack lives inside the pill, and the
 * trailing arrow nudges forward on hover. The avatar rings match the pill
 * surface so the stack blends into the button.
 */
export function Button6({
  label,
  asChild = false,
  children,
  avatars,
  href,
  tone = "dark",
  onClick,
  className,
}: Button6Props) {
  const styles = toneStyles[tone];

  const classes = cn(
    "group/button6 inline-flex w-fit cursor-pointer items-center gap-3 rounded-full py-2 pl-2 pr-6 text-base font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    styles.root,
    className
  );

  const inner = (
    <>
      <span className="flex shrink-0 -space-x-2">
        {avatars.map((src) => (
          <img
            key={src}
            src={src}
            alt=""
            width={32}
            height={32}
            className={cn("size-8 rounded-full border-2 object-cover", styles.ring)}
          />
        ))}
      </span>
      {label}
      <ArrowRight className="size-4 shrink-0 transition-transform duration-300 ease-out motion-safe:group-hover/button6:translate-x-1" />
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

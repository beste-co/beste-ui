"use client";

import type * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "light" | "primary";

interface Card25Props {
  /** Product photo, fills the whole card */
  src: string;
  /** Product name in the bottom left */
  name: string;
  /** Price line under the name (e.g. "$189" or "$29/m") */
  price?: string;
  /** Pill button label */
  cta: string;
  /** If set, the button renders as a link to this href */
  href?: string;
  /** Button click handler (used when there is no href) */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  /** Pill button color */
  tone?: Tone;
  /** Additional classes merged onto the root */
  className?: string;
}

const toneStyles: Record<Tone, string> = {
  light: "bg-white text-zinc-900 hover:bg-zinc-100",
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
};

export const card25Demo: Card25Props = {
  src: "https://images.unsplash.com/photo-1781336541742-497caa97663f?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  name: "Orbit One",
  price: "$189",
  cta: "Shop now",
  href: "#",
};

/**
 * A full bleed product card: the photo is the card, a bottom scrim keeps the
 * white name and price readable on any image, and a floating pill button
 * sits bottom right.
 */
export function Card25({
  src,
  name,
  price,
  cta,
  href,
  onClick,
  tone = "light",
  className,
}: Card25Props) {
  const pillClasses = cn(
    "shrink-0 cursor-pointer rounded-full px-5 py-2.5 text-base font-semibold shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
    toneStyles[tone]
  );

  return (
    <div
      className={cn(
        "relative aspect-[4/3] w-full max-w-sm overflow-hidden rounded-2xl bg-muted",
        className
      )}
    >
      <img src={src} alt={name} className="absolute inset-0 size-full object-cover" />
      {/* Scrim keeps the overlay text readable on any photo */}
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"
      />

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
        <div className="min-w-0">
          <p className="truncate text-2xl font-semibold tracking-tight text-white">{name}</p>
          {price && <p className="text-base text-white/75">{price}</p>}
        </div>
        {href ? (
          <a href={href} className={pillClasses}>
            {cta}
          </a>
        ) : (
          <button type="button" onClick={onClick} className={pillClasses}>
            {cta}
          </button>
        )}
      </div>
    </div>
  );
}

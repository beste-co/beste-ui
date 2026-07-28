"use client";

import type * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "light" | "primary";

interface Card26Props {
  /** Product photo, fills the whole card */
  src: string;
  /** Small bold brand line in the top left */
  brand: string;
  /** Muted line under the brand (e.g. the product type) */
  subtitle?: string;
  /** Bold availability line in the bottom left (e.g. "Launching Friday") */
  status: string;
  /** Muted line under the status */
  statusNote?: string;
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

export const card26Demo: Card26Props = {
  src: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=800&auto=format&fit=crop",
  brand: "LUMO",
  subtitle: "Field Camera",
  status: "Launching Friday",
  statusNote: "Join the waitlist",
  cta: "Join list",
  href: "#",
};

/**
 * A portrait product teaser: brand header up top, availability footer down
 * low, and a floating pill button. Top and bottom scrims keep the white
 * overlay text readable on any photo.
 */
export function Card26({
  src,
  brand,
  subtitle,
  status,
  statusNote,
  cta,
  href,
  onClick,
  tone = "light",
  className,
}: Card26Props) {
  const pillClasses = cn(
    "shrink-0 cursor-pointer rounded-full px-4 py-2 text-base font-semibold shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
    toneStyles[tone]
  );

  return (
    <div
      className={cn(
        "relative aspect-[3/4] w-full max-w-xs overflow-hidden rounded-2xl bg-muted",
        className
      )}
    >
      <img src={src} alt={brand} className="absolute inset-0 size-full object-cover" />
      {/* Scrims keep the overlay text readable on any photo */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent"
      />
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/75 to-transparent"
      />

      <div className="absolute left-5 top-5">
        <p className="text-sm font-bold uppercase tracking-widest text-white">{brand}</p>
        {subtitle && <p className="mt-0.5 text-base text-white/70">{subtitle}</p>}
      </div>

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
        <div className="min-w-0">
          <p className="truncate text-lg font-semibold tracking-tight text-white">{status}</p>
          {statusNote && <p className="text-sm text-white/70">{statusNote}</p>}
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

"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

type Availability = "free" | "soon" | "busy";

interface MetaRow {
  label: string;
  value: string;
}

interface Avatar {
  src: string;
  alt: string;
}

interface Card31Props {
  avatar?: Avatar;
  name?: string;
  role?: string;
  status?: string;
  availability?: Availability;
  rows?: MetaRow[];
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}

const dotStyles: Record<Availability, string> = {
  free: "bg-emerald-500",
  soon: "bg-amber-500",
  busy: "bg-rose-500",
};


/* The card sets the colour and everything inside it is drawn in `current`, so
   inverting is two classes rather than a condition on every element.
   `glass` is a deliberate exception to the solid-surface rule: these pieces sit
   over section background images, and a frosted panel is the point of it. */
const surfaceClasses: Record<Surface, { plain: string; inverted: string }> = {
  card: {
    plain: "bg-card text-card-foreground",
    inverted: "bg-foreground text-background",
  },
  glass: {
    plain: "bg-card/60 text-card-foreground backdrop-blur-md",
    inverted: "bg-foreground/60 text-background backdrop-blur-md",
  },
};

export const card31Demo: Card31Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  avatar: {
    src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=160&h=160&fit=crop",
    alt: "Portrait of Priya Nandan",
  },
  name: "Priya Nandan",
  role: "Migration engineer",
  status: "Free from 09:30 today",
  availability: "free",
  rows: [
    { label: "Call length", value: "30 minutes" },
    { label: "Based in", value: "Bristol, UK" },
    { label: "Has migrated", value: "40+ practices" },
  ],
};

export function Card31({
  avatar,
  name,
  role,
  status,
  availability = "free",
  rows = [],
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Card31Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <div className={cn("w-full max-w-80 rounded-md p-5 shadow-xl", surfaceTone, bordered && "border border-current/15")}>
        <div className="flex items-center gap-3">
          {avatar && (
            <img
              className="size-12 shrink-0 rounded-full object-cover"
              src={avatar.src}
              alt={avatar.alt}
            />
          )}
          <div className="min-w-0 flex-1">
            {name && (
              <p className="truncate text-sm font-semibold">{name}</p>
            )}
            {role && <p className="truncate text-sm text-current/60">{role}</p>}
          </div>
        </div>

        {status && (
          <p className="mt-3 flex items-center gap-2 text-sm">
            <span
              className={cn("size-1.5 shrink-0 rounded-full", dotStyles[availability])}
              aria-hidden="true"
            />
            {status}
          </p>
        )}

        {rows.length > 0 && (
          <div className="mt-3 flex flex-col gap-2 border-t border-current/15 pt-3">
            {rows.map((row, index) => (
              <div key={index} className="flex items-baseline justify-between gap-3">
                <span className="shrink-0 text-sm text-current/60">{row.label}</span>
                <span className="truncate text-sm">{row.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

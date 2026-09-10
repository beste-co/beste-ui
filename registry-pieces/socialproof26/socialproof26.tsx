"use client";

import { Quote } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Avatar {
  src: string;
  alt: string;
}

interface Socialproof26Props {
  quote?: string;
  name?: string;
  role?: string;
  avatar?: Avatar;
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}


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

export const socialproof26Demo: Socialproof26Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  quote: "We moved eleven years of records over a weekend and nobody had to work Monday twice.",
  name: "Elena Rourke",
  role: "Practice lead, Bramble Health",
  avatar: {
    src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&h=160&fit=crop",
    alt: "Portrait of Elena Rourke",
  },
};

export function Socialproof26({ quote, name, role, avatar, surface = "card", bordered = true, inverted = false, className }: Socialproof26Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <div className={cn("w-full max-w-80 rounded-md p-5 shadow-xl", surfaceTone, bordered && "border border-current/15")}>
        <Quote className="size-4 text-primary" aria-hidden="true" />

        {quote && (
          <p className="mt-3 text-sm leading-relaxed">&ldquo;{quote}&rdquo;</p>
        )}

        <div className="mt-4 flex items-center gap-3 border-t border-current/15 pt-3">
          {avatar && (
            <img
              className="size-9 shrink-0 rounded-full object-cover"
              src={avatar.src}
              alt={avatar.alt}
            />
          )}
          <div className="min-w-0">
            {name && (
              <p className="truncate text-sm font-medium">{name}</p>
            )}
            {role && <p className="truncate text-sm text-current/60">{role}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

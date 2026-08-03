"use client";

import { Quote } from "lucide-react";
import { cn } from "@/lib/utils";

interface Avatar {
  src: string;
  alt: string;
}

interface Socialproof26Props {
  quote?: string;
  name?: string;
  role?: string;
  avatar?: Avatar;
  className?: string;
}

export const socialproof26Demo: Socialproof26Props = {
  quote: "We moved eleven years of records over a weekend and nobody had to work Monday twice.",
  name: "Elena Rourke",
  role: "Practice lead, Bramble Health",
  avatar: {
    src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&h=160&fit=crop",
    alt: "Portrait of Elena Rourke",
  },
};

export function Socialproof26({ quote, name, role, avatar, className }: Socialproof26Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <div className="w-full max-w-80 rounded-md border border-border bg-card p-5 shadow-xl">
        <Quote className="size-4 text-primary" aria-hidden="true" />

        {quote && (
          <p className="mt-3 text-sm leading-relaxed text-card-foreground">&ldquo;{quote}&rdquo;</p>
        )}

        <div className="mt-4 flex items-center gap-3 border-t border-border pt-3">
          {avatar && (
            <img
              className="size-9 shrink-0 rounded-full object-cover"
              src={avatar.src}
              alt={avatar.alt}
            />
          )}
          <div className="min-w-0">
            {name && (
              <p className="truncate text-sm font-medium text-card-foreground">{name}</p>
            )}
            {role && <p className="truncate text-sm text-muted-foreground">{role}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

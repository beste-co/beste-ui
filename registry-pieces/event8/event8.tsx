"use client";

import { Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface Avatar {
  initials: string;
  image?: string;
}

interface Event8Props {
  total?: number;
  avatars?: Avatar[];
  label?: string;
  className?: string;
}

export const event8Demo: Event8Props = {
  total: 128,
  avatars: [
    {
      initials: "BS",
      image:
        "https://images.unsplash.com/photo-1630543092182-325fb1747e8a?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDF8fHxlbnwwfHx8fHw%3D",
    },
    {
      initials: "AK",
      image:
        "https://images.unsplash.com/photo-1637867164935-7bd2e94c690a?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDZ8fHxlbnwwfHx8fHw%3D",
    },
    {
      initials: "PS",
      image:
        "https://images.unsplash.com/photo-1646678669631-a88ba087bdac?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDJ8fHxlbnwwfHx8fHw%3D",
    },
    {
      initials: "KO",
      image:
        "https://images.unsplash.com/photo-1642635785885-f0883f842c38?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE0fHx8ZW58MHx8fHx8",
    },
    { initials: "JR" },
  ],
  label: "Beste Sözen, Andrea Kim and 126 others are going",
};

export function Event8({ total = 0, avatars = [], label, className }: Event8Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <div className="flex w-full max-w-80 items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex -space-x-2">
          {avatars.map((a, idx) => (
            <span
              key={idx}
              className="relative flex size-8 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-xs font-semibold text-white ring-2 ring-card"
            >
              {a.image ? (
                <img src={a.image} alt={a.initials} className="absolute inset-0 size-full object-cover" />
              ) : (
                a.initials
              )}
            </span>
          ))}
          <span className="flex size-8 items-center justify-center rounded-full bg-muted text-xs font-semibold text-card-foreground ring-2 ring-card">
            +{Math.max(0, total - avatars.length)}
          </span>
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {total} attending
          </span>
          {label && <span className="truncate text-xs text-card-foreground">{label}</span>}
        </div>
      </div>
    </div>
  );
}

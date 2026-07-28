"use client";

import { Phone, Video } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { cn } from "@/lib/utils";

interface Member {
  src?: string;
  alt?: string;
  fallback: string;
}

interface Chat3Props {
  title?: string;
  members?: Member[];
  count?: number;
  membersLabel?: string;
  className?: string;
}

export const chat3Demo: Chat3Props = {
  title: "Design Team",
  count: 12,
  membersLabel: "members",
  members: [
    {
      src: "https://images.unsplash.com/photo-1600603405959-6d623e92445c?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDF8fHxlbnwwfHx8fHw%3D",
      alt: "Ayşe",
      fallback: "AK",
    },
    {
      src: "https://images.unsplash.com/photo-1728516687021-905c3feb5046?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDJ8fHxlbnwwfHx8fHw%3D",
      alt: "Merve",
      fallback: "MÖ",
    },
    {
      src: "https://images.unsplash.com/photo-1731341711390-a721b4e31b6a?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDd8fHxlbnwwfHx8fHw%3D",
      alt: "Sarah",
      fallback: "SB",
    },
  ],
};

export function Chat3({
  title = "Chat",
  members = [],
  count,
  membersLabel = "members",
  className,
}: Chat3Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <div className="flex w-full max-w-80 items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5 shadow-sm">
        <div className="flex items-center -space-x-2">
          {members.slice(0, 3).map((m, i) => (
            <Avatar key={i} className="size-8 border-2 border-card">
              <AvatarImage src={m.src} alt={m.alt} className="object-cover" />
              <AvatarFallback className="text-xs font-semibold">{m.fallback}</AvatarFallback>
            </Avatar>
          ))}
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-sm font-semibold text-card-foreground">{title}</span>
          {typeof count === "number" && (
            <span className="text-xs text-muted-foreground">
              {count} {membersLabel}
            </span>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            aria-label="Voice call"
            className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground"
          >
            <Phone className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Video call"
            className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground"
          >
            <Video className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

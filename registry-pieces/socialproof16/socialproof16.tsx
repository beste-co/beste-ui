"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Member {
  src?: string;
  alt?: string;
  fallback: string;
}

interface Socialproof16Props {
  members?: Member[];
  message?: string;
  className?: string;
}

export const socialproof16Demo: Socialproof16Props = {
  message: "Join 12,480 designers shipping faster",
  members: [
    {
      src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
      alt: "Ayşe",
      fallback: "AK",
    },
    {
      src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
      alt: "Merve",
      fallback: "MÖ",
    },
    {
      src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
      alt: "Sarah",
      fallback: "SB",
    },
  ],
};

export function Socialproof16({
  members = [],
  message,
  className,
}: Socialproof16Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="inline-flex items-center gap-3">
        <div className="flex items-center -space-x-2">
          {members.slice(0, 3).map((m, i) => (
            <Avatar key={i} className="size-7 border-2 border-background">
              <AvatarImage src={m.src} alt={m.alt} className="object-cover" />
              <AvatarFallback className="text-xs font-semibold">
                {m.fallback}
              </AvatarFallback>
            </Avatar>
          ))}
        </div>
        {message && (
          <span className="text-sm text-card-foreground">{message}</span>
        )}
      </div>
    </div>
  );
}

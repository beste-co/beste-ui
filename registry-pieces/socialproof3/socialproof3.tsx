"use client";

import { Quote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Socialproof3Props {
  quote?: string;
  authorName?: string;
  authorRole?: string;
  avatarSrc?: string;
  avatarAlt?: string;
  fallback?: string;
  className?: string;
}

export const socialproof3Demo: Socialproof3Props = {
  quote:
    "Shipped our marketing site in a weekend. The blocks feel designed, not generated.",
  authorName: "Deniz Arslan",
  authorRole: "Co-founder, Sable",
  avatarSrc:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face",
  avatarAlt: "Deniz Arslan",
  fallback: "DA",
};

export function Socialproof3({
  quote,
  authorName,
  authorRole,
  avatarSrc,
  avatarAlt,
  fallback = "??",
  className,
}: Socialproof3Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="relative flex w-full max-w-80 flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
        <Quote
          className="absolute right-3 top-3 size-6 text-muted-foreground/30"
          aria-hidden="true"
        />
        {quote && (
          <p className="pr-6 text-sm leading-relaxed text-card-foreground">
            {quote}
          </p>
        )}
        <div className="flex items-center gap-2.5 border-t border-border pt-3">
          <Avatar className="size-8">
            <AvatarImage
              src={avatarSrc}
              alt={avatarAlt}
              className="object-cover"
            />
            <AvatarFallback className="text-xs font-semibold">
              {fallback}
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm font-semibold text-card-foreground">
              {authorName}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {authorRole}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

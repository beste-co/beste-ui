"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { cn } from "@/lib/utils";

interface Socialproof7Props {
  src?: string;
  alt?: string;
  fallback?: string;
  quote?: string;
  name?: string;
  className?: string;
}

export const socialproof7Demo: Socialproof7Props = {
  src: "https://images.unsplash.com/flagged/photo-1583485114917-1d0b5dedf5b0?w=70&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDIzfHx8ZW58MHx8fHx8",
  alt: "Uğur Sözen",
  fallback: "AK",
  quote: "Shipped three landings in a weekend.",
  name: "Ayşe K., Designer",
};

export function Socialproof7({
  src,
  alt,
  fallback = "??",
  quote,
  name,
  className,
}: Socialproof7Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 items-start gap-3">
        <Avatar className="size-8 shrink-0">
          <AvatarImage src={src} alt={alt} className="object-cover" />
          <AvatarFallback className="text-xs font-semibold">
            {fallback}
          </AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          {quote && (
            <span className="text-sm leading-snug text-card-foreground">
              “{quote}”
            </span>
          )}
          {name && (
            <span className="text-xs text-muted-foreground">{name}</span>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { cn } from "@/lib/utils";

interface Chat9Props {
  src?: string;
  alt?: string;
  fallback?: string;
  name?: string;
  preview?: string;
  time?: string;
  unread?: number;
  className?: string;
}

export const chat9Demo: Chat9Props = {
  src: "https://images.unsplash.com/photo-1543096222-72de739f7917?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTM5fHxwb3J0cmFpdHxlbnwwfHwwfHx8MA%3D%3D",
  alt: "Ayşe",
  fallback: "AK",
  name: "Ayşe Kaya",
  preview: "Sure, sending the Figma link now",
  time: "09:42",
  unread: 3,
};

export function Chat9({
  src,
  alt,
  fallback = "??",
  name,
  preview,
  time,
  unread,
  className,
}: Chat9Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5 shadow-sm">
        <Avatar className="size-11">
          <AvatarImage src={src} alt={alt} className="object-cover" />
          <AvatarFallback className="text-sm font-semibold">
            {fallback}
          </AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-baseline justify-between gap-2">
            <span className="truncate text-sm font-semibold text-card-foreground">
              {name}
            </span>
            {time && (
              <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                {time}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between gap-2">
            {preview && (
              <span className="truncate text-xs text-muted-foreground">
                {preview}
              </span>
            )}
            {typeof unread === "number" && unread > 0 && (
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary px-1 font-mono text-xs font-bold text-primary-foreground">
                {unread > 9 ? "9+" : unread}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

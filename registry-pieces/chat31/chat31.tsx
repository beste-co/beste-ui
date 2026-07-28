"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { cn } from "@/lib/utils";

interface Chat31Props {
  src?: string;
  alt?: string;
  fallback?: string;
  author?: string;
  role?: string;
  message?: string;
  time?: string;
  className?: string;
}

export const chat31Demo: Chat31Props = {
  src: "https://images.unsplash.com/photo-1577806934037-32d94e326e84?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTkxfHxwb3J0cmFpdHxlbnwwfHwwfHx8MA%3D%3D",
  alt: "Ayşe",
  fallback: "AK",
  author: "Ayşe Kaya",
  role: "Designer",
  message: "Pushed a new pass on the empty states — peek when you have a sec 🎨",
  time: "09:42",
};

export function Chat31({
  src,
  alt,
  fallback = "??",
  author = "Author",
  role,
  message,
  time,
  className,
}: Chat31Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 items-start gap-2.5">
        <Avatar className="size-9 shrink-0">
          <AvatarImage src={src} alt={alt} className="object-cover" />
          <AvatarFallback className="text-xs font-semibold">
            {fallback}
          </AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <div className="flex items-baseline gap-2">
            <span className="truncate text-sm font-semibold text-card-foreground">
              {author}
            </span>
            {role && (
              <span className="shrink-0 rounded-full bg-primary/10 px-1.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-primary">
                {role}
              </span>
            )}
            {time && (
              <span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
                {time}
              </span>
            )}
          </div>
          {message && (
            <p className="text-sm leading-snug text-card-foreground">
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Typer {
  src?: string;
  alt?: string;
  fallback: string;
}

interface Chat25Props {
  typers?: Typer[];
  summary?: string;
  bordered?: boolean;
  className?: string;
}

export const chat25Demo: Chat25Props = {
  typers: [
    {
      src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
      alt: "Nils Frahm",
      fallback: "NF",
    },
    {
      src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
      alt: "Hania Rani",
      fallback: "HR",
    },
  ],
  summary: "Nils and Hania are typing",
  bordered: false,
};

export function Chat25({
  typers = [],
  summary,
  bordered = false,
  className,
}: Chat25Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("inline-flex items-center gap-2 rounded-full bg-card px-2.5 py-1.5 shadow-sm", bordered && "border border-border")}>
        <div className="flex items-center -space-x-1.5">
          {typers.slice(0, 3).map((t, i) => (
            <Avatar key={i} className="size-5 border-2 border-card">
              <AvatarImage src={t.src} alt={t.alt} className="object-cover" />
              <AvatarFallback className="text-xs font-semibold">
                {t.fallback}
              </AvatarFallback>
            </Avatar>
          ))}
        </div>
        <span className="text-xs text-muted-foreground">{summary}</span>
        <div className="flex items-center gap-0.5" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="size-1.5 rounded-full bg-muted-foreground animate-pulse"
              style={{
                animationDelay: `${i * 180}ms`,
                animationDuration: "1s",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

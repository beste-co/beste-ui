"use client";

import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "foreground" | "primary" | "muted";

interface Browser1Props {
  url?: string;
  tone?: Tone;
  className?: string;
}

const toneClasses: Record<Tone, string> = {
  foreground: "bg-foreground",
  primary: "bg-primary",
  muted: "bg-muted-foreground",
};

export const browser1Demo: Browser1Props = {
  url: "https://stripe.com",
  tone: "muted",
};

export function Browser1({
  url,
  tone = "foreground",
  className,
}: Browser1Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-56 items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 shadow-sm">
        <Globe
          className="size-3.5 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />
        <span className="flex-1 truncate text-xs font-medium text-card-foreground">
          {url}
        </span>
        <span
          className={cn(
            "h-3 w-0.5 shrink-0 animate-pulse",
            toneClasses[tone]
          )}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

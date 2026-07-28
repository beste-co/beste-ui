"use client";

import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface Browser3Props {
  url?: string;
  title?: string;
  className?: string;
}

export const browser3Demo: Browser3Props = {
  url: "ui.beste.co/components",
  title: "Beste UI",
};

export function Browser3({
  url = "example.com",
  title,
  className,
}: Browser3Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col overflow-hidden rounded-lg border border-border bg-card shadow-md">
        <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-3 py-2">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="size-2.5 rounded-full bg-rose-500" />
            <span className="size-2.5 rounded-full bg-amber-500" />
            <span className="size-2.5 rounded-full bg-emerald-500" />
          </div>
          <div className="flex flex-1 items-center gap-1.5 rounded-md border border-border bg-card px-2 py-0.5">
            <Globe
              className="size-3 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
            <span className="truncate font-mono text-xs text-muted-foreground">
              {url}
            </span>
          </div>
        </div>
        <div className="flex min-h-20 items-center justify-center px-4 py-5">
          {title && (
            <span className="text-lg font-semibold text-card-foreground">
              {title}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Upload28Props {
  filename?: string;
  url?: string;
  expiry?: string;
  viewers?: string;
  bordered?: boolean;
  className?: string;
}

export const upload28Demo: Upload28Props = {
  filename: "board-deck.pdf",
  url: "beste.co/share/Kq91-2Xa",
  expiry: "Expires in 7 days",
  bordered: false,
};

export function Upload28({
  filename,
  url,
  expiry,
  viewers,
  bordered = false,
  className,
}: Upload28Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-md bg-card p-3 shadow-sm", bordered && "border border-border")}>
        <div className="flex items-center gap-2">
          <Share2 className="size-5 shrink-0 text-sky-500" aria-hidden="true" />
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm font-semibold text-card-foreground">
              {filename}
            </span>
            {viewers && (
              <span className="truncate text-xs text-muted-foreground">
                {viewers}
              </span>
            )}
          </div>
        </div>
        <div className={cn("flex items-center overflow-hidden rounded-md bg-muted", bordered && "border border-border")}>
          <span className="flex-1 truncate px-3 py-1.5 text-xs text-card-foreground">
            {url}
          </span>
          <button
            type="button"
            className="shrink-0 border-l border-border bg-foreground px-3 py-1.5 text-xs font-semibold text-background hover:opacity-90"
          >
            Copy
          </button>
        </div>
        {expiry && (
          <span className="text-xs text-muted-foreground">{expiry}</span>
        )}
      </div>
    </div>
  );
}

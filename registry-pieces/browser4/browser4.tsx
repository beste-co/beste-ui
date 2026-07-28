"use client";

import { Lock, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface Browser4Props {
  url?: string;
  secure?: boolean;
  className?: string;
}

export const browser4Demo: Browser4Props = {
  url: "https://stripe.com/dashboard",
  secure: true,
};

export function Browser4({
  url = "https://example.com",
  secure = true,
  className,
}: Browser4Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 shadow-sm">
        {secure && (
          <Lock
            className="size-3.5 shrink-0 text-emerald-500"
            aria-hidden="true"
          />
        )}
        <span className="flex-1 truncate font-mono text-sm text-card-foreground">
          {url}
        </span>
        <button
          type="button"
          aria-label="Reload"
          className="flex size-6 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground"
        >
          <RefreshCw className="size-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

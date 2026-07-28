"use client";

import { ArrowLeft, ArrowRight, Home, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface Browser6Props {
  canGoBack?: boolean;
  canGoForward?: boolean;
  className?: string;
}

export const browser6Demo: Browser6Props = {
  canGoBack: true,
  canGoForward: false,
};

export function Browser6({
  canGoBack = true,
  canGoForward = true,
  className,
}: Browser6Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="inline-flex items-center gap-1 rounded-full border border-border bg-card p-1 shadow-sm">
        {[
          { Icon: ArrowLeft, label: "Back", disabled: !canGoBack },
          { Icon: ArrowRight, label: "Forward", disabled: !canGoForward },
          { Icon: RefreshCw, label: "Reload" },
          { Icon: Home, label: "Home" },
        ].map(({ Icon, label, disabled }) => (
          <button
            key={label}
            type="button"
            aria-label={label}
            disabled={disabled}
            className="flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground disabled:opacity-40 disabled:hover:bg-transparent"
          >
            <Icon className="size-3.5" aria-hidden="true" />
          </button>
        ))}
      </div>
    </div>
  );
}

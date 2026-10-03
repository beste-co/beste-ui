"use client";

import { Download } from "lucide-react";
import { cn } from "@/lib/utils";

interface Browser14Props {
  appName?: string;
  description?: string;
  bordered?: boolean;
  className?: string;
}

export const browser14Demo: Browser14Props = {
  appName: "Beste",
  description: "Install to get the full-screen app with offline support.",
  bordered: false,
};

export function Browser14({
  appName = "This site",
  description,
  bordered = false,
  className,
}: Browser14Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 items-center gap-3 rounded-lg bg-card p-3 shadow-lg", bordered && "border border-border")}>
        <Download className="size-5 shrink-0 text-primary" aria-hidden="true" />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="truncate text-sm font-semibold text-card-foreground">
            Install {appName}
          </span>
          {description && (
            <span className="text-xs leading-snug text-muted-foreground">
              {description}
            </span>
          )}
        </div>
        <button
          type="button"
          className="shrink-0 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Install
        </button>
      </div>
    </div>
  );
}

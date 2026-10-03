"use client";

import { WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface Browser26Props {
  title?: string;
  description?: string;
  bordered?: boolean;
  className?: string;
}

export const browser26Demo: Browser26Props = {
  title: "You're offline",
  description: "Reconnect to the internet to keep browsing.",
  bordered: false,
};

export function Browser26({
  title = "Offline",
  description,
  bordered = false,
  className,
}: Browser26Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-72 items-center gap-3 rounded-md bg-rose-100 px-3 py-2.5 shadow-md dark:bg-rose-950", bordered && "border border-rose-500/40")}>
        <WifiOff className="size-5 shrink-0 text-rose-500" aria-hidden="true" />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="text-sm font-semibold text-rose-700 dark:text-rose-200">
            {title}
          </span>
          {description && (
            <span className="text-xs leading-snug text-rose-700/80 dark:text-rose-200/80">
              {description}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

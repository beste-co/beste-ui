"use client";

import { Languages } from "lucide-react";
import { cn } from "@/lib/utils";

interface Browser22Props {
  from?: string;
  to?: string;
  bordered?: boolean;
  className?: string;
}

export const browser22Demo: Browser22Props = {
  from: "Deutsch",
  to: "English",
  bordered: false,
};

export function Browser22({
  from = "Source",
  to = "Target",
  bordered = false,
  className,
}: Browser22Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 items-center gap-3 rounded-lg bg-card p-3 shadow-md", bordered && "border border-border")}>
        <Languages
          className="size-6 shrink-0 text-sky-600 dark:text-sky-400"
          aria-hidden="true"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="text-sm font-semibold text-card-foreground">
            Translate this page?
          </span>
          <span className="truncate text-xs text-muted-foreground">
            From <span className="font-medium text-card-foreground">{from}</span>{" "}
            to{" "}
            <span className="font-medium text-card-foreground">{to}</span>
          </span>
        </div>
        <button
          type="button"
          className="shrink-0 rounded-md bg-sky-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-sky-600"
        >
          Translate
        </button>
      </div>
    </div>
  );
}

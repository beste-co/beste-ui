"use client";

import { VenetianMask } from "lucide-react";
import { cn } from "@/lib/utils";

interface Browser32Props {
  title?: string;
  subtitle?: string;
  className?: string;
}

export const browser32Demo: Browser32Props = {
  title: "You've gone Incognito",
  subtitle: "Now you can browse privately",
};

export function Browser32({
  title = "You've gone Incognito",
  subtitle,
  className,
}: Browser32Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 items-center gap-3 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 shadow-md">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-zinc-700 text-zinc-200">
          <VenetianMask className="size-5" aria-hidden="true" />
        </div>
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-semibold text-zinc-50">
            {title}
          </span>
          {subtitle && (
            <span className="truncate text-xs text-zinc-400">{subtitle}</span>
          )}
        </div>
      </div>
    </div>
  );
}

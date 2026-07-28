"use client";

import { cn } from "@/lib/utils";

interface Shapes10Props {
  className?: string;
}

export const shapes10Demo: Shapes10Props = {};

export function Shapes10({ className }: Shapes10Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex flex-col gap-3" aria-hidden="true">
        <div className="relative h-6 w-11 rounded-full bg-emerald-500">
          <span className="absolute right-0.5 top-0.5 size-5 rounded-full bg-card shadow-sm" />
        </div>
        <div className="relative h-6 w-11 rounded-full bg-muted">
          <span className="absolute left-0.5 top-0.5 size-5 rounded-full bg-card shadow-sm" />
        </div>
      </div>
    </div>
  );
}

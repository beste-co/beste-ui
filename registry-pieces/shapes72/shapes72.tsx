"use client";

import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Shapes72Props {
  className?: string;
}

export const shapes72Demo: Shapes72Props = {};

export function Shapes72({ className }: Shapes72Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className="flex w-48 items-center gap-2.5 rounded-md border border-border bg-card p-3 shadow-md"
        aria-hidden="true"
      >
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-500">
          <Check className="size-3.5 text-white" />
        </span>
        <div className="flex flex-1 flex-col gap-1">
          <span className="h-1.5 w-2/3 rounded-full bg-foreground/70" />
          <span className="h-1 w-full rounded-full bg-muted" />
        </div>
        <X className="size-3 shrink-0 text-muted-foreground" />
      </div>
    </div>
  );
}

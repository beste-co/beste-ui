"use client";

import { Eraser, Pencil } from "lucide-react";

import { cn } from "@/lib/utils";

interface Legal9Props {
  label?: string;
  hint?: string;
  sample?: string;
  className?: string;
}

export const legal9Demo: Legal9Props = {
  label: "Draw your signature",
  hint: "Use your trackpad or stylus",
  sample: "Beste Sözen",
};

export function Legal9({
  label = "Draw your signature",
  hint,
  sample,
  className,
}: Legal9Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-lg border border-dashed border-border bg-muted/40 p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <Pencil
            className="size-3.5 text-muted-foreground"
            aria-hidden="true"
          />
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {label}
          </span>
          <button
            type="button"
            className="ml-auto inline-flex items-center gap-1 rounded text-xs text-muted-foreground hover:text-card-foreground"
          >
            <Eraser className="size-3" aria-hidden="true" />
            Clear
          </button>
        </div>
        <div className="relative flex h-24 items-end justify-center overflow-hidden rounded-md bg-card">
          {sample && (
            <span className="absolute inset-0 flex items-center justify-center font-serif text-3xl italic text-card-foreground">
              {sample}
            </span>
          )}
          <span
            className="mb-2 h-px w-4/5 bg-border"
            aria-hidden="true"
          />
        </div>
        {hint && (
          <span className="text-xs text-muted-foreground">{hint}</span>
        )}
      </div>
    </div>
  );
}

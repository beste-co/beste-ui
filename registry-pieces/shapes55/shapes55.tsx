"use client";

import { Quote } from "lucide-react";
import { cn } from "@/lib/utils";

interface Shapes55Props {
  className?: string;
}

export const shapes55Demo: Shapes55Props = {};

export function Shapes55({ className }: Shapes55Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className="flex w-44 flex-col gap-2 rounded-md border border-border bg-card p-3 shadow-sm"
        aria-hidden="true"
      >
        <Quote className="size-5 fill-foreground/20 text-foreground/20" />
        <span className="h-1.5 w-full rounded-full bg-muted" />
        <span className="h-1.5 w-5/6 rounded-full bg-muted" />
        <span className="h-1.5 w-2/3 rounded-full bg-muted" />
        <div className="mt-1 flex flex-col gap-1">
          <span className="h-1.5 w-14 rounded-full bg-foreground/70" />
          <span className="h-1 w-10 rounded-full bg-muted" />
        </div>
      </div>
    </div>
  );
}

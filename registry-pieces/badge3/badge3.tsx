"use client";

import { Ticket } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "primary" | "foreground" | "rose" | "emerald" | "violet";

interface Badge3Props {
  code?: string;
  discount?: string;
  tone?: Tone;
  className?: string;
}

const toneClasses: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  rose: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400",
  emerald:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  violet:
    "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-400",
};

export const badge3Demo: Badge3Props = {
  code: "BESTE20",
  discount: "20% OFF",
  tone: "rose",
};

export function Badge3({
  code = "CODE",
  discount = "10% OFF",
  tone = "rose",
  className,
}: Badge3Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="inline-flex overflow-hidden rounded-lg border-2 border-dashed border-border bg-card shadow-sm">
        <div className="flex items-center gap-2 px-3 py-2">
          <Ticket
            className="size-4 text-muted-foreground"
            aria-hidden="true"
          />
          <span className="font-mono text-sm font-bold tracking-wider text-card-foreground">
            {code}
          </span>
        </div>
        <div
          className={cn(
            "flex items-center border-l-2 border-dashed border-border px-3 py-2",
            toneClasses[tone]
          )}
        >
          <span className="text-xs font-bold uppercase tracking-wide">
            {discount}
          </span>
        </div>
      </div>
    </div>
  );
}

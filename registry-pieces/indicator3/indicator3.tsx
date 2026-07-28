"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "primary" | "foreground" | "muted";

interface Indicator3Props {
  label?: string;
  tone?: Tone;
  className?: string;
}

const toneClasses: Record<Tone, string> = {
  primary: "text-primary",
  foreground: "text-foreground",
  muted: "text-muted-foreground",
};

export const indicator3Demo: Indicator3Props = {
  label: "Syncing workspace",
  tone: "primary",
};

export function Indicator3({
  label,
  tone = "primary",
  className,
}: Indicator3Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 shadow-sm">
        <Loader2
          className={cn("size-3.5 animate-spin", toneClasses[tone])}
          aria-hidden="true"
        />
        {label && (
          <span className="text-sm font-medium text-card-foreground">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}

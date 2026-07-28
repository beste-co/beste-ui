"use client";

import { Download } from "lucide-react";
import { cn } from "@/lib/utils";

interface Upload4Props {
  title?: string;
  subtitle?: string;
  className?: string;
}

export const upload4Demo: Upload4Props = {
  title: "Drop to upload",
  subtitle: "Release anywhere in this area",
};

export function Upload4({
  title = "Drop to upload",
  subtitle,
  className,
}: Upload4Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col items-center gap-2 rounded-xl border-2 border-dashed border-foreground bg-card px-6 py-8 text-center shadow-sm">
        <div className="flex size-10 items-center justify-center rounded-full bg-muted text-foreground">
          <Download className="size-5" aria-hidden="true" />
        </div>
        <span className="text-sm font-semibold text-foreground">
          {title}
        </span>
        {subtitle && (
          <span className="text-xs text-muted-foreground">{subtitle}</span>
        )}
      </div>
    </div>
  );
}

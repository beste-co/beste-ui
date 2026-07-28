"use client";

import { FileUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Upload8Props {
  title?: string;
  formats?: string[];
  limit?: string;
  action?: string;
  className?: string;
}

export const upload8Demo: Upload8Props = {
  title: "Upload artwork",
  formats: ["PNG", "JPG", "SVG", "WebP"],
  limit: "Up to 10 MB",
  action: "Browse files",
};

export function Upload8({
  title,
  formats = [],
  limit,
  action = "Browse",
  className,
}: Upload8Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col items-center gap-3 rounded-xl border-2 border-dashed border-border bg-card px-5 py-6 text-center shadow-sm">
        <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <FileUp className="size-4" aria-hidden="true" />
        </div>
        {title && (
          <span className="text-sm font-semibold text-card-foreground">
            {title}
          </span>
        )}
        {formats.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-1">
            {formats.map((fmt, idx) => (
              <span
                key={idx}
                className="rounded-full border border-border bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground"
              >
                {fmt}
              </span>
            ))}
          </div>
        )}
        {limit && (
          <span className="text-xs text-muted-foreground">{limit}</span>
        )}
        <button
          type="button"
          className="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-semibold text-card-foreground shadow-sm hover:bg-muted"
        >
          {action}
        </button>
      </div>
    </div>
  );
}

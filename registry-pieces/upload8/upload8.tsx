"use client";

import { FileUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Upload8Props {
  title?: string;
  formats?: string[];
  limit?: string;
  action?: string;
  bordered?: boolean;
  className?: string;
}

export const upload8Demo: Upload8Props = {
  title: "Upload artwork",
  formats: ["PNG", "JPG", "SVG", "WebP"],
  limit: "Up to 10 MB",
  action: "Browse files",
  bordered: false,
};

export function Upload8({
  title,
  formats = [],
  limit,
  action = "Browse",
  bordered = false,
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
        <FileUp className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
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
                className={cn("rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground", bordered && "border border-border")}
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
          className={cn("rounded-md px-3 py-1.5 text-xs font-semibold text-card-foreground shadow-sm hover:bg-muted", bordered ? "border border-border bg-background" : "bg-muted hover:bg-muted-foreground/15")}
        >
          {action}
        </button>
      </div>
    </div>
  );
}

"use client";

import { Scale } from "lucide-react";
import { cn } from "@/lib/utils";

interface Legal5Props {
  section?: string;
  heading?: string;
  body?: string;
  source?: string;
  className?: string;
}

export const legal5Demo: Legal5Props = {
  section: "§ 4.2",
  heading: "Limitation of liability",
  body: "In no event shall either party be liable for any indirect, incidental, special, or consequential damages arising out of this agreement, even if advised of the possibility of such damages.",
  source: "Master services agreement · MSA-2026-0421",
};

export function Legal5({
  section,
  heading,
  body,
  source,
  className,
}: Legal5Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-lg border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-amber-500/15 px-1.5 py-0.5 font-mono text-xs font-semibold text-amber-700 dark:text-amber-300">
            {section}
          </span>
          {heading && (
            <span className="truncate text-sm font-semibold text-card-foreground">
              {heading}
            </span>
          )}
        </div>
        {body && (
          <p className="text-sm leading-relaxed text-muted-foreground">
            {body}
          </p>
        )}
        {source && (
          <div className="flex items-center gap-1.5 border-t border-border pt-2 text-xs text-muted-foreground">
            <Scale className="size-3" aria-hidden="true" />
            <span className="truncate">{source}</span>
          </div>
        )}
      </div>
    </div>
  );
}

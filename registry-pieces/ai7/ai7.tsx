"use client";

import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

interface Ai7Props {
  title?: string;
  prompt?: string;
  className?: string;
}

export const ai7Demo: Ai7Props = {
  title: "System prompt",
  prompt:
    "You are a concise copywriter. Reply in 2 sentences max and avoid em dashes.",
};

export function Ai7({
  title = "System",
  prompt,
  className,
}: Ai7Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-md border border-dashed border-border bg-card px-3 py-2.5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {title}
          </span>
          <button
            type="button"
            aria-label="Edit prompt"
            className="flex size-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground"
          >
            <Pencil className="size-3" aria-hidden="true" />
          </button>
        </div>
        {prompt && (
          <p className="text-xs leading-snug text-card-foreground">
            {prompt}
          </p>
        )}
      </div>
    </div>
  );
}

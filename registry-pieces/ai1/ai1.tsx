"use client";

import { ArrowUp, Paperclip, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Ai1Props {
  placeholder?: string;
  value?: string;
  className?: string;
}

export const ai1Demo: Ai1Props = {
  placeholder: "Ask anything...",
  value: "Write a landing page hero for a coffee roaster",
};

export function Ai1({
  placeholder = "Ask",
  value = "",
  className,
}: Ai1Props) {
  const hasValue = value.length > 0;

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-2xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-start gap-2">
          <Sparkles
            className="mt-0.5 size-4 shrink-0 text-violet-500"
            aria-hidden="true"
          />
          <p
            className={cn(
              "min-w-0 flex-1 text-sm leading-snug",
              hasValue ? "text-card-foreground" : "text-muted-foreground"
            )}
          >
            {hasValue ? value : placeholder}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <button
            type="button"
            aria-label="Attach"
            className="flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground"
          >
            <Paperclip className="size-3.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Send"
            disabled={!hasValue}
            className={cn(
              "flex size-7 items-center justify-center rounded-full transition-colors",
              hasValue
                ? "bg-foreground text-background hover:bg-foreground/90"
                : "bg-muted text-muted-foreground"
            )}
          >
            <ArrowUp className="size-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

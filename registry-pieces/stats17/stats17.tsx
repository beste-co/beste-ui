"use client";

import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Side {
  label: string;
  value: string;
  caption: string;
}

interface Stats17Props {
  title?: string;
  before?: Side;
  after?: Side;
  footnote?: string;
  className?: string;
}

export const stats17Demo: Stats17Props = {
  title: "Time to first booking",
  before: { label: "Before", value: "9 days", caption: "across three systems" },
  after: { label: "After", value: "4 hours", caption: "on one workspace" },
  footnote: "Median across eleven practices that switched last quarter.",
};

export function Stats17({ title, before, after, footnote, className }: Stats17Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <div className="w-full max-w-96 rounded-md border border-border bg-card p-5 shadow-xl">
        {title && <p className="text-sm font-semibold text-card-foreground">{title}</p>}

        <div className="mt-4 flex items-center gap-4">
          {before && (
            <div className="min-w-0 flex-1">
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                {before.label}
              </p>
              <p className="mt-1 text-2xl font-light tracking-tight tabular-nums text-muted-foreground">
                {before.value}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">{before.caption}</p>
            </div>
          )}

          <ArrowRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />

          {after && (
            <div className="min-w-0 flex-1">
              <p className="font-mono text-xs uppercase tracking-widest text-primary">
                {after.label}
              </p>
              <p className="mt-1 text-2xl font-light tracking-tight tabular-nums text-card-foreground">
                {after.value}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">{after.caption}</p>
            </div>
          )}
        </div>

        {footnote && (
          <p className="mt-4 border-t border-border pt-3 text-sm leading-relaxed text-muted-foreground">
            {footnote}
          </p>
        )}
      </div>
    </div>
  );
}

"use client";

import { Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Ai37Filter {
  key: string;
  value: string;
}

interface Ai37Props {
  namespace?: string;
  topK?: number;
  filters?: Ai37Filter[];
  className?: string;
}

export const ai37Demo: Ai37Props = {
  namespace: "docs",
  topK: 5,
  filters: [
    { key: "lang", value: "en" },
    { key: "section", value: "guides" },
  ],
};

export function Ai37({
  namespace = "namespace",
  topK = 5,
  filters = [],
  className,
}: Ai37Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-md border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-mono text-xs">
            <Filter
              className="size-3 text-muted-foreground"
              aria-hidden="true"
            />
            <span className="text-card-foreground">{namespace}</span>
          </div>
          <span className="font-mono text-xs text-muted-foreground">
            top_k = {topK}
          </span>
        </div>
        <div className="flex flex-wrap gap-1">
          {filters.map((f) => (
            <span
              key={f.key}
              className="inline-flex items-center gap-1 rounded-sm border border-border bg-muted px-1.5 py-0.5 font-mono text-xs"
            >
              <span className="text-muted-foreground">{f.key}:</span>
              <span className="text-card-foreground">{f.value}</span>
              <X
                className="size-2.5 text-muted-foreground"
                aria-hidden="true"
              />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

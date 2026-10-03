"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Ai37Filter {
  key: string;
  value: string;
}

interface Ai37Props {
  namespace?: string;
  topK?: number;
  filters?: Ai37Filter[];
  bordered?: boolean;
  className?: string;
}

export const ai37Demo: Ai37Props = {
  namespace: "docs",
  topK: 5,
  filters: [
    { key: "lang", value: "en" },
    { key: "section", value: "guides" },
  ],
  bordered: false,
};

export function Ai37({
  namespace = "namespace",
  topK = 5,
  filters = [],
  bordered = false,
  className,
}: Ai37Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-md bg-card p-3 shadow-sm", bordered && "border border-border")}>
        <div className="flex items-center justify-between">
          <span className="text-xs text-card-foreground">{namespace}</span>
          <span className="text-xs text-muted-foreground">
            top_k = {topK}
          </span>
        </div>
        <div className="flex flex-wrap gap-1">
          {filters.map((f) => (
            <span
              key={f.key}
              className={cn("inline-flex items-center gap-1 rounded-sm bg-muted px-1.5 py-0.5 text-xs", bordered && "border border-border")}
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

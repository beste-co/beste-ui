"use client";

import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Input9Props {
  value?: string;
  placeholder?: string;
  className?: string;
}

export const input9Demo: Input9Props = {
  value: "design tokens",
  placeholder: "Search files…",
};

export function Input9({
  value = "",
  placeholder = "Search…",
  className,
}: Input9Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 items-center gap-2 rounded-full border border-border bg-card px-4 py-2 shadow-sm">
        <Search
          className="size-3.5 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />
        <span
          className={cn(
            "flex-1 truncate text-sm",
            value ? "text-card-foreground" : "text-muted-foreground"
          )}
        >
          {value || placeholder}
        </span>
        {value && (
          <button
            type="button"
            className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-muted-foreground/10 hover:text-card-foreground"
            aria-label="Clear"
          >
            <X className="size-3" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}

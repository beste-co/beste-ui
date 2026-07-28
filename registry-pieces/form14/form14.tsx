"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Form14Props {
  label?: string;
  tags?: string[];
  placeholder?: string;
  hint?: string;
  className?: string;
}

export const form14Demo: Form14Props = {
  label: "Topics",
  tags: ["design systems", "typography", "motion"],
  placeholder: "Type and press ↵",
  hint: "Up to 8 tags. Use hyphens instead of spaces.",
};

export function Form14({
  label,
  tags = [],
  placeholder = "Add a tag",
  hint,
  className,
}: Form14Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-1.5">
        {label && (
          <label className="text-xs font-medium text-card-foreground">
            {label}
          </label>
        )}
        <div className="flex flex-wrap items-center gap-1.5 rounded-md border border-border bg-card px-2 py-1.5 shadow-sm">
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 rounded-md bg-muted py-0.5 pl-2 pr-1 text-xs font-medium text-card-foreground"
            >
              {tag}
              <button
                type="button"
                className="flex size-4 items-center justify-center rounded text-muted-foreground hover:bg-muted-foreground/10 hover:text-card-foreground"
                aria-label={`Remove ${tag}`}
              >
                <X className="size-3" aria-hidden="true" />
              </button>
            </span>
          ))}
          <span className="flex-1 px-1 py-0.5 text-xs text-muted-foreground">
            {placeholder}
          </span>
        </div>
        {hint && (
          <span className="text-xs text-muted-foreground">{hint}</span>
        )}
      </div>
    </div>
  );
}

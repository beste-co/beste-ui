"use client";

import { Mail } from "lucide-react";
import { cn } from "@/lib/utils";

interface Input1Props {
  placeholder?: string;
  cta?: string;
  className?: string;
}

export const input1Demo: Input1Props = {
  placeholder: "you@company.com",
  cta: "Subscribe",
};

export function Input1({
  placeholder = "Enter your email",
  cta = "Submit",
  className,
}: Input1Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 items-center gap-1 rounded-lg border border-border bg-card p-1 shadow-sm">
        <div className="flex flex-1 items-center gap-2 px-2.5">
          <Mail
            className="size-3.5 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <span className="flex-1 truncate text-sm text-muted-foreground">
            {placeholder}
          </span>
        </div>
        <button
          type="button"
          className="shrink-0 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {cta}
        </button>
      </div>
    </div>
  );
}

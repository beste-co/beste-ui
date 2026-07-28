"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface Form13Props {
  label?: string;
  value?: string;
  defaultVisible?: boolean;
  caps?: boolean;
  className?: string;
}

function mask(value: string) {
  return "•".repeat(value.length);
}

export const form13Demo: Form13Props = {
  label: "Current password",
  value: "correct-horse-battery",
  defaultVisible: false,
  caps: true,
};

export function Form13({
  label,
  value = "",
  defaultVisible = false,
  caps = false,
  className,
}: Form13Props) {
  const [visible, setVisible] = useState(defaultVisible);

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
        <div className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 shadow-sm">
          <span className="flex-1 truncate font-mono text-sm tracking-wider text-card-foreground">
            {visible ? value : mask(value)}
          </span>
          {caps && (
            <span className="shrink-0 rounded bg-amber-500/10 px-1.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">
              Caps
            </span>
          )}
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="flex size-6 shrink-0 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-card-foreground"
            aria-label={visible ? "Hide password" : "Show password"}
          >
            {visible ? (
              <EyeOff className="size-3.5" aria-hidden="true" />
            ) : (
              <Eye className="size-3.5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

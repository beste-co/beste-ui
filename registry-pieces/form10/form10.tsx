"use client";

import { cn } from "@/lib/utils";

interface Form10Props {
  label?: string;
  placeholder?: string;
  value?: string;
  action?: string;
  hint?: string;
  className?: string;
}

export const form10Demo: Form10Props = {
  label: "Invite teammates",
  placeholder: "name@company.com",
  value: "lara@beste.co",
  action: "Send invite",
  hint: "They'll get an email with a link that expires in 72 hours.",
};

export function Form10({
  label,
  placeholder,
  value,
  action = "Send",
  hint,
  className,
}: Form10Props) {
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
        <div className="flex items-stretch overflow-hidden rounded-md border border-border bg-card shadow-sm">
          <span
            className={cn(
              "flex-1 truncate px-3 py-2 text-sm",
              value ? "text-card-foreground" : "text-muted-foreground"
            )}
          >
            {value || placeholder}
          </span>
          <button
            type="button"
            className="shrink-0 border-l border-border bg-foreground px-3 text-xs font-semibold text-background hover:opacity-90"
          >
            {action}
          </button>
        </div>
        {hint && (
          <span className="text-xs text-muted-foreground">{hint}</span>
        )}
      </div>
    </div>
  );
}

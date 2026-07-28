"use client";

import { AlertCircle, X } from "lucide-react";

import { cn } from "@/lib/utils";

interface EmailToken {
  address: string;
  valid?: boolean;
}

interface Form17Props {
  label?: string;
  emails?: EmailToken[];
  placeholder?: string;
  error?: string;
  className?: string;
}

export const form17Demo: Form17Props = {
  label: "Invite by email",
  emails: [
    { address: "lara@beste.co", valid: true },
    { address: "nils@beste.co", valid: true },
    { address: "om@acme", valid: false },
  ],
  placeholder: "Separate with commas",
  error: "om@acme is missing the domain ending.",
};

export function Form17({
  label,
  emails = [],
  placeholder = "email@company.com",
  error,
  className,
}: Form17Props) {
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
          {emails.map((t, idx) => (
            <span
              key={idx}
              className={cn(
                "inline-flex items-center gap-1 rounded-md py-0.5 pl-2 pr-1 text-xs font-medium",
                t.valid === false
                  ? "bg-rose-500/15 text-rose-700 dark:text-rose-400"
                  : "bg-muted text-card-foreground"
              )}
            >
              {t.valid === false && (
                <AlertCircle
                  className="size-3 text-rose-500"
                  aria-hidden="true"
                />
              )}
              {t.address}
              <button
                type="button"
                className="flex size-4 items-center justify-center rounded hover:bg-muted-foreground/10"
                aria-label={`Remove ${t.address}`}
              >
                <X className="size-3" aria-hidden="true" />
              </button>
            </span>
          ))}
          <span className="flex-1 px-1 text-xs text-muted-foreground">
            {placeholder}
          </span>
        </div>
        {error && (
          <span className="text-xs font-medium text-rose-600 dark:text-rose-400">
            {error}
          </span>
        )}
      </div>
    </div>
  );
}

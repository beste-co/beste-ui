"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

interface Form36Props {
  label?: string;
  placeholder?: string;
  submitLabel?: string;
  finePrint?: string;
  className?: string;
}

export const form36Demo: Form36Props = {
  label: "Get the launch note",
  placeholder: "you@practice.com",
  submitLabel: "Join",
  finePrint: "One email when we open the doors. Nothing else.",
};

export function Form36({ label, placeholder, submitLabel, finePrint, className }: Form36Props) {
  const emailId = useId();

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <div className="w-full max-w-96 rounded-md border border-border bg-card p-5 shadow-xl">
        {label && (
          <label htmlFor={emailId} className="text-sm font-medium text-card-foreground">
            {label}
          </label>
        )}

        <div className="mt-2 flex gap-2">
          <input
            id={emailId}
            type="email"
            placeholder={placeholder}
            className="h-10 min-w-0 flex-1 rounded-md border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            type="button"
            className="h-10 shrink-0 cursor-pointer rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {submitLabel}
          </button>
        </div>

        {finePrint && <p className="mt-2 text-sm text-muted-foreground">{finePrint}</p>}
      </div>
    </div>
  );
}

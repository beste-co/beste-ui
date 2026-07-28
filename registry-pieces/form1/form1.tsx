"use client";

import { cn } from "@/lib/utils";

interface Form1Props {
  label?: string;
  placeholder?: string;
  value?: string;
  helper?: string;
  className?: string;
}

export const form1Demo: Form1Props = {
  label: "Workspace name",
  placeholder: "Beste Studio",
  value: "Mira & Co.",
  helper: "Shown on invoices and in the team directory.",
};

export function Form1({
  label,
  placeholder,
  value,
  helper,
  className,
}: Form1Props) {
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
        <div className="rounded-md border border-border bg-card px-3 py-2 shadow-sm">
          <span
            className={cn(
              "block text-sm",
              value ? "text-card-foreground" : "text-muted-foreground"
            )}
          >
            {value || placeholder}
          </span>
        </div>
        {helper && (
          <span className="text-xs text-muted-foreground">{helper}</span>
        )}
      </div>
    </div>
  );
}

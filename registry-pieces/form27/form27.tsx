"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Form27Props {
  label?: string;
  value?: string;
  placeholder?: string;
  open?: boolean;
  options?: string[];
  className?: string;
}

export const form27Demo: Form27Props = {
  label: "Default currency",
  value: "USD · US Dollar",
  placeholder: "Select a currency",
  open: true,
  options: ["USD · US Dollar", "EUR · Euro", "GBP · British Pound", "TRY · Turkish Lira"],
};

export function Form27({
  label,
  value,
  placeholder = "Select",
  open = false,
  options = [],
  className,
}: Form27Props) {
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
        <div className="relative">
          <div
            className={cn(
              "flex items-center gap-2 rounded-md border bg-card px-3 py-2 shadow-sm",
              open ? "border-primary ring-2 ring-primary/20" : "border-border"
            )}
          >
            <span
              className={cn(
                "flex-1 truncate text-sm",
                value ? "text-card-foreground" : "text-muted-foreground"
              )}
            >
              {value || placeholder}
            </span>
            <ChevronDown
              className={cn(
                "size-3.5 shrink-0 text-muted-foreground transition-transform",
                open && "rotate-180"
              )}
              aria-hidden="true"
            />
          </div>
          {open && options.length > 0 && (
            <div className="mt-1 flex flex-col overflow-hidden rounded-md border border-border bg-card shadow-md">
              {options.map((opt, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={cn(
                    "px-3 py-1.5 text-left text-sm",
                    opt === value
                      ? "bg-muted font-semibold text-card-foreground"
                      : "text-card-foreground hover:bg-muted/60"
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

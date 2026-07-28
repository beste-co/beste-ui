"use client";

import { cn } from "@/lib/utils";

interface Form5Props {
  label?: string;
  prefix?: string;
  suffix?: string;
  value?: string;
  placeholder?: string;
  className?: string;
}

export const form5Demo: Form5Props = {
  label: "Custom domain",
  prefix: "https://",
  suffix: ".beste.co",
  value: "docs",
  placeholder: "your-subdomain",
};

export function Form5({
  label,
  prefix,
  suffix,
  value,
  placeholder,
  className,
}: Form5Props) {
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
          {prefix && (
            <span className="flex items-center border-r border-border bg-muted px-3 text-sm text-muted-foreground">
              {prefix}
            </span>
          )}
          <span
            className={cn(
              "flex-1 truncate px-3 py-2 text-sm",
              value ? "text-card-foreground" : "text-muted-foreground"
            )}
          >
            {value || placeholder}
          </span>
          {suffix && (
            <span className="flex items-center border-l border-border bg-muted px-3 text-sm text-muted-foreground">
              {suffix}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

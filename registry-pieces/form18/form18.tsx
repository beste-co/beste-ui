"use client";

import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";

interface ComboOption {
  label: string;
  detail?: string;
}

interface Form18Props {
  label?: string;
  value?: string;
  query?: string;
  options?: ComboOption[];
  selectedIndex?: number;
  className?: string;
}

export const form18Demo: Form18Props = {
  label: "Primary workspace",
  value: "Mira Studio",
  query: "acm",
  options: [
    { label: "Beste Studio", detail: "Design · 12 members" },
    { label: "Besteworks", detail: "Engineering · 34 members" },
    { label: "Beste Labs", detail: "Research · 6 members" },
  ],
  selectedIndex: 0,
};

export function Form18({
  label,
  value,
  query = "",
  options = [],
  selectedIndex = 0,
  className,
}: Form18Props) {
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
          <span className="flex-1 truncate text-sm text-card-foreground">
            {value}
          </span>
          <ChevronsUpDown
            className="size-3.5 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
        </div>
        <div className="flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-md">
          <div className="border-b border-border px-3 py-2">
            <span className="text-sm text-muted-foreground">
              {query}
              <span
                className="ml-0.5 inline-block h-3.5 w-px animate-pulse bg-muted-foreground align-middle"
                aria-hidden="true"
              />
            </span>
          </div>
          {options.map((opt, idx) => (
            <div
              key={idx}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 text-sm",
                idx === selectedIndex && "bg-muted"
              )}
            >
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-card-foreground">
                  {opt.label}
                </span>
                {opt.detail && (
                  <span className="truncate text-xs text-muted-foreground">
                    {opt.detail}
                  </span>
                )}
              </div>
              {idx === selectedIndex && (
                <Check
                  className="size-3.5 shrink-0 text-emerald-500"
                  aria-hidden="true"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

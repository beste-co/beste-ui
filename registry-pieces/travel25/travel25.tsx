"use client";

import { CheckSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface Travel25Props {
  title?: string;
  items?: { label: string; done?: boolean }[];
  className?: string;
}

export const travel25Demo: Travel25Props = {
  title: "Packing list · Lisbon",
  items: [
    { label: "Passport + photocopy", done: true },
    { label: "Universal adapter", done: true },
    { label: "Sunscreen SPF 50" },
    { label: "Running shoes" },
    { label: "Reusable water bottle", done: true },
    { label: "Light jacket" },
  ],
};

export function Travel25({
  title,
  items = [],
  className,
}: Travel25Props) {
  const done = items.filter((i) => i.done).length;

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckSquare
              className="size-3.5 text-muted-foreground"
              aria-hidden="true"
            />
            {title && (
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {title}
              </span>
            )}
          </div>
          <span className="font-mono text-xs text-card-foreground">
            {done} / {items.length}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1">
          {items.map((item, idx) => (
            <label
              key={idx}
              className={cn(
                "flex items-center gap-2 text-sm",
                item.done && "opacity-60"
              )}
            >
              <span
                className={cn(
                  "flex size-3.5 shrink-0 items-center justify-center rounded border",
                  item.done
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : "border-border bg-card"
                )}
                aria-hidden="true"
              >
                {item.done && (
                  <svg viewBox="0 0 16 16" className="size-3">
                    <path
                      d="M3 8 L6.5 11 L13 5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                )}
              </span>
              <span
                className={cn(
                  "truncate",
                  item.done
                    ? "text-muted-foreground line-through"
                    : "text-card-foreground"
                )}
              >
                {item.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

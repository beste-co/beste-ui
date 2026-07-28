"use client";

import { cn } from "@/lib/utils";

interface Toggle {
  label: string;
  enabled?: boolean;
}

interface Form35Props {
  title?: string;
  items?: Toggle[];
  className?: string;
}

export const form35Demo: Form35Props = {
  title: "Notifications",
  items: [
    { label: "New bookings", enabled: true },
    { label: "Payment received", enabled: true },
    { label: "Weekly summary", enabled: false },
  ],
};

export function Form35({ title, items = [], className }: Form35Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="w-full max-w-72 rounded-md border border-border bg-card p-4 shadow-xl">
        {title && (
          <p className="mb-3 text-sm font-semibold text-card-foreground">
            {title}
          </p>
        )}
        <div className="flex flex-col gap-3">
          {items.map((item, index) => (
            <div key={index} className="flex items-center justify-between gap-3">
              <span className="text-sm text-card-foreground">{item.label}</span>
              <span
                className={cn(
                  "flex h-5 w-9 items-center rounded-full p-0.5 transition-colors",
                  item.enabled ? "justify-end bg-primary" : "justify-start bg-muted"
                )}
                aria-hidden="true"
              >
                <span className="size-4 rounded-full bg-background shadow-sm" />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

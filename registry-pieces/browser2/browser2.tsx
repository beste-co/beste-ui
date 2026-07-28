"use client";

import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface Tab {
  title: string;
  active?: boolean;
}

interface Browser2Props {
  tabs?: Tab[];
  className?: string;
}

export const browser2Demo: Browser2Props = {
  tabs: [
    { title: "Dashboard", active: true },
    { title: "Billing" },
    { title: "Settings" },
  ],
};

export function Browser2({ tabs = [], className }: Browser2Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 items-end gap-0.5 border-b border-border px-1">
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={cn(
              "flex items-center gap-2 rounded-t-md border border-b-0 px-3 py-1.5",
              tab.active
                ? "border-border bg-card text-card-foreground"
                : "border-transparent bg-transparent text-muted-foreground"
            )}
          >
            <Globe className="size-3 shrink-0" aria-hidden="true" />
            <span className="max-w-24 truncate text-xs font-medium">
              {tab.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

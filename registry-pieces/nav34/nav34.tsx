"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Tab {
  label: string;
  content: string;
}

interface Nav34Props {
  tabs?: Tab[];
  intervalMs?: number;
  className?: string;
}

export const nav34Demo: Nav34Props = {
  tabs: [
    { label: "Overview", content: "12 open projects, 3 due this week" },
    { label: "Activity", content: "Björk commented on Mixdown v3" },
    { label: "Settings", content: "Two-factor auth is on for 8 of 9 members" },
    { label: "Billing", content: "Next invoice: $1,240 on 1 Oct" },
  ],
};

export function Nav34({ tabs = [], intervalMs = 2200, className }: Nav34Props) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (tabs.length <= 1) return;
    const id = setInterval(() => setActive((a) => (a + 1) % tabs.length), intervalMs);
    return () => clearInterval(id);
  }, [tabs.length, intervalMs]);

  const count = Math.max(1, tabs.length);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <style>{`@keyframes nav34-fade { from { opacity: 0; transform: translateY(0.25rem); } to { opacity: 1; transform: none; } }`}</style>
      <div className="flex w-full max-w-80 flex-col gap-3 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="relative flex rounded-lg bg-muted p-1" role="tablist">
          <span
            className="absolute inset-y-1 left-1 rounded-md bg-card shadow-sm transition-transform duration-500 ease-in-out motion-reduce:transition-none"
            style={{
              width: `calc((100% - 0.5rem) / ${count})`,
              transform: `translateX(${active * 100}%)`,
            }}
            aria-hidden="true"
          />
          {tabs.map((tab, i) => (
            <button
              key={tab.label}
              type="button"
              role="tab"
              aria-selected={i === active}
              onClick={() => setActive(i)}
              className={cn(
                "relative z-10 h-7 flex-1 cursor-pointer truncate rounded-md px-2 text-xs font-medium transition-colors duration-300",
                i === active ? "text-card-foreground" : "text-muted-foreground hover:text-card-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <p
          key={active}
          className="h-5 truncate px-1 text-sm text-muted-foreground"
          style={{ animation: "nav34-fade 400ms ease-out" }}
        >
          {tabs[active]?.content}
        </p>
      </div>
    </div>
  );
}

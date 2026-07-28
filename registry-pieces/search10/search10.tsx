"use client";

import { FileText, Search, User } from "lucide-react";

import { cn } from "@/lib/utils";

interface GroupedSearch {
  group: string;
  items: { label: string; hint?: string }[];
}

interface Search10Props {
  query?: string;
  groups?: GroupedSearch[];
  className?: string;
}

export const search10Demo: Search10Props = {
  query: "mira",
  groups: [
    {
      group: "Files",
      items: [
        { label: "mira-handoff.fig", hint: "Figma" },
        { label: "brand-mira.pdf", hint: "Doc" },
      ],
    },
  ],
};

const iconForGroup = (group: string) => {
  if (group.toLowerCase() === "people") return User;
  return FileText;
};

export function Search10({
  query = "",
  groups = [],
  className,
}: Search10Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-xl">
        <div className="flex items-center gap-2 border-b border-border px-3 py-2">
          <Search
            className="size-3.5 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <span className="flex-1 truncate text-sm text-card-foreground">
            {query}
          </span>
        </div>
        <div className="flex flex-col gap-2 p-2">
          {groups.map((g, gIdx) => {
            const Icon = iconForGroup(g.group);
            return (
              <div key={gIdx} className="flex flex-col">
                <span className="px-2 pb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {g.group}
                </span>
                {g.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm"
                  >
                    <Icon
                      className="size-3.5 shrink-0 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <span className="flex-1 truncate text-card-foreground">
                      {item.label}
                    </span>
                    {item.hint && (
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {item.hint}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

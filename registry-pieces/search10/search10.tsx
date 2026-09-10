"use client";

import { FileText, Search, User } from "lucide-react";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface GroupedSearch {
  group: string;
  items: { label: string; hint?: string }[];
}

interface Search10Props {
  query?: string;
  groups?: GroupedSearch[];
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}


/* The card sets the colour and everything inside it is drawn in `current`, so
   inverting is two classes rather than a condition on every element.
   `glass` is a deliberate exception to the solid-surface rule: these pieces sit
   over section background images, and a frosted panel is the point of it. */
const surfaceClasses: Record<Surface, { plain: string; inverted: string }> = {
  card: {
    plain: "bg-card text-card-foreground",
    inverted: "bg-foreground text-background",
  },
  glass: {
    plain: "bg-card/60 text-card-foreground backdrop-blur-md",
    inverted: "bg-foreground/60 text-background backdrop-blur-md",
  },
};

export const search10Demo: Search10Props = {
  surface: "card",
  bordered: true,
  inverted: false,
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
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Search10Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col overflow-hidden rounded-xl shadow-xl", surfaceTone, bordered && "border border-current/15")}>
        <div className="flex items-center gap-2 border-b border-current/15 px-3 py-2">
          <Search
            className="size-3.5 shrink-0 text-current/60"
            aria-hidden="true"
          />
          <span className="flex-1 truncate text-sm">
            {query}
          </span>
        </div>
        <div className="flex flex-col gap-2 p-2">
          {groups.map((g, gIdx) => {
            const Icon = iconForGroup(g.group);
            return (
              <div key={gIdx} className="flex flex-col">
                <span className="px-2 pb-1 text-xs font-semibold uppercase tracking-wide text-current/60">
                  {g.group}
                </span>
                {g.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm"
                  >
                    <Icon
                      className="size-3.5 shrink-0 text-current/60"
                      aria-hidden="true"
                    />
                    <span className="flex-1 truncate">
                      {item.label}
                    </span>
                    {item.hint && (
                      <span className="shrink-0 text-xs text-current/60">
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

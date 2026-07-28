"use client";

import { BarChart3, FolderKanban, Home, Settings, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarGroup {
  label: string;
  items: { label: string; icon: "home" | "kanban" | "users" | "chart" | "settings"; active?: boolean; count?: number }[];
}

interface Nav14Props {
  groups?: SidebarGroup[];
  className?: string;
}

const iconMap = {
  home: Home,
  kanban: FolderKanban,
  users: Users,
  chart: BarChart3,
  settings: Settings,
};

export const nav14Demo: Nav14Props = {
  groups: [
    {
      label: "Workspace",
      items: [
        { label: "Home", icon: "home", active: true },
        { label: "Projects", icon: "kanban", count: 4 },
        { label: "Team", icon: "users" },
      ],
    },
    {
      label: "Admin",
      items: [
        { label: "Analytics", icon: "chart" },
        { label: "Settings", icon: "settings" },
      ],
    },
  ],
};

export function Nav14({ groups = [], className }: Nav14Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-48 flex-col gap-3 rounded-lg border border-border bg-card p-2 shadow-sm">
        {groups.map((g, gIdx) => (
          <div key={gIdx} className="flex flex-col gap-0.5">
            <span className="px-2 pb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {g.label}
            </span>
            {g.items.map((item, idx) => {
              const Icon = iconMap[item.icon];
              return (
                <button
                  key={idx}
                  type="button"
                  className={cn(
                    "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                    item.active
                      ? "bg-muted font-semibold text-card-foreground"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-card-foreground"
                  )}
                >
                  <Icon className="size-3.5" aria-hidden="true" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {typeof item.count === "number" && (
                    <span
                      className={cn(
                        "rounded-full px-1.5 py-0.5 text-xs font-semibold",
                        item.active
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

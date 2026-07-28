"use client";

import { Code2, Eye, FileText, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface IconTab {
  label: string;
  icon: "preview" | "code" | "docs" | "settings";
}

interface Nav12Props {
  tabs?: IconTab[];
  activeIndex?: number;
  className?: string;
}

const iconMap = {
  preview: Eye,
  code: Code2,
  docs: FileText,
  settings: Settings,
};

export const nav12Demo: Nav12Props = {
  tabs: [
    { label: "Preview", icon: "preview" },
    { label: "Code", icon: "code" },
    { label: "Readme", icon: "docs" },
    { label: "Settings", icon: "settings" },
  ],
  activeIndex: 0,
};

export function Nav12({
  tabs = [],
  activeIndex = 0,
  className,
}: Nav12Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="inline-flex items-center gap-1 rounded-lg border border-border bg-card p-1 shadow-sm">
        {tabs.map((tab, idx) => {
          const Icon = iconMap[tab.icon];
          return (
            <button
              key={idx}
              type="button"
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-colors",
                idx === activeIndex
                  ? "bg-foreground text-background shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-card-foreground"
              )}
            >
              <Icon className="size-3.5" aria-hidden="true" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

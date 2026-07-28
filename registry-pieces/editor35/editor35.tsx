"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark" | "system";

interface Editor35Props {
  active?: Theme;
  className?: string;
}

const themes: { id: Theme; Icon: typeof Sun; label: string }[] = [
  { id: "light", Icon: Sun, label: "Light" },
  { id: "dark", Icon: Moon, label: "Dark" },
  { id: "system", Icon: Monitor, label: "System" },
];

export const editor35Demo: Editor35Props = {
  active: "system",
};

export function Editor35({ active = "system", className }: Editor35Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 flex-col gap-2 rounded-md border border-border bg-card p-3 shadow-sm">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Theme
        </span>
        <div className="inline-flex items-center gap-0.5 rounded-md border border-border bg-card p-0.5">
          {themes.map(({ id, Icon, label }) => {
            const isActive = id === active;
            return (
              <button
                key={id}
                type="button"
                aria-pressed={isActive}
                className={cn(
                  "flex h-8 flex-1 items-center justify-center gap-1.5 rounded transition-colors",
                  isActive
                    ? "bg-muted text-card-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-card-foreground"
                )}
              >
                <Icon className="size-3.5" aria-hidden="true" />
                <span className="text-xs font-medium">{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

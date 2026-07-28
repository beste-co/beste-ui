"use client";

import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "emerald" | "amber" | "muted";

interface Row {
  name: string;
  status: string;
  tone?: Tone;
}

interface Browser34Props {
  url?: string;
  rows?: Row[];
  className?: string;
}

const pillStyles: Record<Tone, string> = {
  emerald: "bg-emerald-500/10 text-emerald-600",
  amber: "bg-amber-500/10 text-amber-600",
  muted: "bg-muted text-muted-foreground",
};

export const browser34Demo: Browser34Props = {
  url: "app.sirius.care/members",
  rows: [
    { name: "Rowan Blake", status: "Active", tone: "emerald" },
    { name: "Amelia Frost", status: "Intake", tone: "amber" },
    { name: "Noah Reyes", status: "Discharged", tone: "muted" },
  ],
};

export function Browser34({ url, rows = [], className }: Browser34Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="w-full max-w-80 overflow-hidden rounded-md border border-border bg-card shadow-xl">
        <div className="flex items-center gap-2 border-b border-border bg-muted px-3 py-2">
          <div className="flex gap-1.5" aria-hidden="true">
            <span className="size-2.5 rounded-full bg-rose-400" />
            <span className="size-2.5 rounded-full bg-amber-400" />
            <span className="size-2.5 rounded-full bg-emerald-400" />
          </div>
          {url && (
            <div className="ml-2 flex flex-1 items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1">
              <Lock
                className="size-3 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
              <span className="truncate font-mono text-xs text-muted-foreground">
                {url}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 p-4">
          {rows.map((row, index) => (
            <div
              key={index}
              className="flex items-center gap-3 rounded-md border border-border px-3 py-2"
            >
              <span
                className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground"
                aria-hidden="true"
              >
                {row.name.charAt(0)}
              </span>
              <span className="flex-1 truncate text-sm text-card-foreground">
                {row.name}
              </span>
              <span
                className={cn(
                  "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
                  pillStyles[row.tone ?? "muted"]
                )}
              >
                {row.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import { FolderOpen, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface DataRoomFolder {
  name: string;
  files: number;
  accessed?: string;
  locked?: boolean;
}

interface Legal26Props {
  heading?: string;
  folders?: DataRoomFolder[];
  className?: string;
}

export const legal26Demo: Legal26Props = {
  heading: "Due diligence room",
  folders: [
    {
      name: "Corporate · Certifications",
      files: 18,
      accessed: "Last accessed 2h ago",
    },
    {
      name: "Financials · Audited",
      files: 42,
      accessed: "Last accessed Tue",
    },
    {
      name: "HR · Compensation",
      files: 12,
      locked: true,
    },
  ],
};

export function Legal26({
  heading,
  folders = [],
  className,
}: Legal26Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        {heading && (
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {heading}
          </span>
        )}
        <div className="flex flex-col divide-y divide-border">
          {folders.map((f, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 py-1.5"
            >
              <div
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-md",
                  f.locked
                    ? "bg-rose-500/15 text-rose-500"
                    : "bg-amber-500/15 text-amber-500"
                )}
              >
                {f.locked ? (
                  <Lock className="size-4" aria-hidden="true" />
                ) : (
                  <FolderOpen className="size-4" aria-hidden="true" />
                )}
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-medium text-card-foreground">
                  {f.name}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {f.files} files {f.accessed && `· ${f.accessed}`}
                </span>
              </div>
              {f.locked && (
                <span className="shrink-0 rounded-full bg-rose-500/15 px-2 py-0.5 text-xs font-semibold text-rose-700 dark:text-rose-300">
                  Restricted
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

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
  bordered?: boolean;
  className?: string;
}

export const legal26Demo: Legal26Props = {
  folders: [
    {
      name: "Corporate · Certifications",
      files: 18,
    },
    {
      name: "Financials · Audited",
      files: 42,
    },
    {
      name: "HR · Compensation",
      files: 12,
      locked: true,
    },
  ],
  bordered: false,
};

export function Legal26({
  heading,
  folders = [],
  bordered = false,
  className,
}: Legal26Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-xl bg-card p-3 shadow-sm", bordered && "border border-border")}>
        {heading && (
          <span className="text-xs font-semibold text-muted-foreground">
            {heading}
          </span>
        )}
        <div className="flex flex-col divide-y divide-border">
          {folders.map((f, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 py-1.5"
            >
              {f.locked ? (
                <Lock className="size-5 shrink-0 text-rose-500" aria-hidden="true" />
              ) : (
                <FolderOpen className="size-5 shrink-0 text-amber-500" aria-hidden="true" />
              )}
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-medium text-card-foreground">
                  {f.name}
                </span>
                <span className="truncate text-xs tabular-nums text-muted-foreground">
                  {f.files} files{f.accessed ? ` · ${f.accessed}` : ""}
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

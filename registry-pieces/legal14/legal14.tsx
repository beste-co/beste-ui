"use client";

import { FileText } from "lucide-react";

import { cn } from "@/lib/utils";

interface Version {
  label: string;
  author?: string;
  at?: string;
  current?: boolean;
  note?: string;
}

interface Legal14Props {
  docName?: string;
  versions?: Version[];
  bordered?: boolean;
  className?: string;
}

export const legal14Demo: Legal14Props = {
  docName: "Master services agreement",
  versions: [
    {
      label: "v4.2",
      author: "Nils Frahm",
      note: "Counsel redline on indemnification",
      current: true,
    },
    {
      label: "v4.1",
      author: "Hania Rani",
      note: "Updated pricing schedule",
    },
    {
      label: "v4.0",
      author: "Ólafur Arnalds",
      note: "Initial redline",
    },
  ],
  bordered: false,
};

export function Legal14({
  docName,
  versions = [],
  bordered = false,
  className,
}: Legal14Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-xl bg-card p-3 shadow-sm", bordered && "border border-border")}>
        <div className="flex items-center gap-2">
          <FileText className="size-5 shrink-0 text-indigo-500" aria-hidden="true" />
          {docName && (
            <span className="truncate text-sm font-semibold text-card-foreground">
              {docName}
            </span>
          )}
        </div>
        <div className="flex flex-col">
          {versions.map((v, idx) => (
            <div
              key={idx}
              className="relative flex items-start gap-2.5 pb-3 last:pb-0"
            >
              {idx < versions.length - 1 && (
                <span
                  className="absolute bottom-0 left-3 top-6 w-px bg-border"
                  aria-hidden="true"
                />
              )}
              <span
                className={cn(
                  "mt-0.5 size-6 shrink-0 rounded-full border-2",
                  v.current
                    ? "border-emerald-500 bg-emerald-500"
                    : "border-border bg-card"
                )}
                aria-hidden="true"
              />
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-semibold text-card-foreground">
                    {v.label}
                  </span>
                  {v.current && (
                    <span className="rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                      Current
                    </span>
                  )}
                </div>
                {v.note && (
                  <span className="truncate text-xs text-card-foreground">
                    {v.note}
                  </span>
                )}
                {(v.author || v.at) && (
                  <span className="truncate text-xs text-muted-foreground">
                    {[v.author, v.at].filter(Boolean).join(" · ")}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

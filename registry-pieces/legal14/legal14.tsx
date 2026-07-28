"use client";

import { Clock, FileText } from "lucide-react";

import { cn } from "@/lib/utils";

interface Version {
  label: string;
  author: string;
  at: string;
  current?: boolean;
  note?: string;
}

interface Legal14Props {
  docName?: string;
  versions?: Version[];
  className?: string;
}

export const legal14Demo: Legal14Props = {
  docName: "MSA-2026-0421",
  versions: [
    {
      label: "v4.2",
      author: "Beste Sözen",
      at: "Apr 23 · 14:12",
      note: "Counsel redline on indemnification",
      current: true,
    },
    {
      label: "v4.1",
      author: "Kian Okafor",
      at: "Apr 21 · 10:02",
      note: "Updated pricing schedule",
    },
    {
      label: "v4.0",
      author: "Legal ops",
      at: "Apr 18 · 09:44",
      note: "Initial redline",
    },
  ],
};

export function Legal14({
  docName,
  versions = [],
  className,
}: Legal14Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-md bg-indigo-500/15 text-indigo-500">
            <FileText className="size-4" aria-hidden="true" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Versions
            </span>
            <span className="font-mono text-xs text-card-foreground">
              {docName}
            </span>
          </div>
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
                  "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border-2",
                  v.current
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : "border-border bg-card text-muted-foreground"
                )}
              >
                <Clock className="size-3" aria-hidden="true" />
              </span>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-mono font-semibold text-card-foreground">
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
                <span className="truncate text-xs text-muted-foreground">
                  {v.author} · {v.at}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

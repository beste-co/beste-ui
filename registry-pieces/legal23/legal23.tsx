"use client";

import { BookMarked } from "lucide-react";
import { cn } from "@/lib/utils";

interface Citation {
  label: string;
  court?: string;
  holding?: string;
}

interface Legal23Props {
  title?: string;
  citations?: Citation[];
  className?: string;
}

export const legal23Demo: Legal23Props = {
  title: "Relevant authority",
  citations: [
    {
      label: "Smith v. Beste Labs, 42 F.4th 318 (2d Cir. 2023)",
      court: "Second Circuit",
      holding: "Applied heightened standard to data-retention claims.",
    },
    {
      label: "In re Kestrel Sec. Litig., 2024 WL 118822",
      court: "S.D.N.Y.",
      holding: "Denied motion to dismiss on reliance pleading.",
    },
  ],
};

export function Legal23({
  title,
  citations = [],
  className,
}: Legal23Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-300">
            <BookMarked className="size-3.5" aria-hidden="true" />
          </div>
          {title && (
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {title}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          {citations.map((c, idx) => (
            <div
              key={idx}
              className="rounded-md bg-muted p-2 text-sm"
            >
              <span className="block font-mono text-xs font-semibold text-card-foreground">
                {c.label}
              </span>
              {c.court && (
                <span className="block text-xs text-muted-foreground">
                  {c.court}
                </span>
              )}
              {c.holding && (
                <span className="mt-1 block text-sm italic text-card-foreground">
                  {c.holding}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import { cn } from "@/lib/utils";

interface Turn {
  role: "Q" | "A" | "By";
  speaker: string;
  line: string;
}

interface Legal19Props {
  turns?: Turn[];
  className?: string;
}

export const legal19Demo: Legal19Props = {
  turns: [
    {
      role: "Q",
      speaker: "Counsel",
      line: "And you first saw the shipment on what date?",
    },
    {
      role: "A",
      speaker: "Witness",
      line: "The morning of March fourteenth, around eight thirty.",
    },
    {
      role: "Q",
      speaker: "Counsel",
      line: "Who else was present at that time?",
    },
  ],
};

const roleClasses: Record<Turn["role"], string> = {
  Q: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  A: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  By: "bg-muted text-muted-foreground",
};

export function Legal19({
  turns = [],
  className,
}: Legal19Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
      
        <div className="flex flex-col gap-1.5">
          {turns.map((t, idx) => (
            <div key={idx} className="flex gap-2">
              <span
                className={cn(
                  "inline-flex size-5 shrink-0 items-center justify-center rounded font-mono text-xs font-bold",
                  roleClasses[t.role]
                )}
              >
                {t.role}
              </span>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {t.speaker}
                </span>
                <span className="text-sm leading-snug text-card-foreground">
                  {t.line}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

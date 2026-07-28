"use client";

import { cn } from "@/lib/utils";

interface Ai41Intent {
  label: string;
  score: number;
}

interface Ai41Props {
  input?: string;
  intents?: Ai41Intent[];
  className?: string;
}

export const ai41Demo: Ai41Props = {
  input: "where is my order?",
  intents: [
    { label: "order_status", score: 0.87 },
    { label: "shipping_eta", score: 0.09 },
    { label: "refund_request", score: 0.04 },
  ],
};

export function Ai41({ input, intents = [], className }: Ai41Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-md border border-border bg-card p-3 shadow-sm">
        {input && (
          <p className="truncate rounded-sm bg-muted px-2 py-1 text-xs italic text-muted-foreground">
            "{input}"
          </p>
        )}
        <div className="flex flex-col gap-1">
          {intents.map((it, i) => {
            const pct = Math.round(it.score * 100);
            const isTop = i === 0;
            return (
              <div key={it.label} className="flex items-center gap-2">
                <span
                  className={cn(
                    "w-28 truncate font-mono text-xs",
                    isTop
                      ? "font-semibold text-card-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {it.label}
                </span>
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      isTop ? "bg-emerald-500" : "bg-muted-foreground/50"
                    )}
                    style={{ width: `${pct}%` }}
                    aria-hidden="true"
                  />
                </div>
                <span className="w-10 text-right font-mono text-xs tabular-nums text-muted-foreground">
                  {pct}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

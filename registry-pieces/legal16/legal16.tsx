"use client";

import { cn } from "@/lib/utils";

interface ComplianceItem {
  name: string;
  status: "pass" | "warn" | "fail";
}

interface Legal16Props {
  score?: number;
  label?: string;
  summary?: string;
  items?: ComplianceItem[];
  className?: string;
}

const statusDot: Record<"pass" | "warn" | "fail", string> = {
  pass: "bg-emerald-500",
  warn: "bg-amber-500",
  fail: "bg-rose-500",
};

const statusLabel: Record<"pass" | "warn" | "fail", string> = {
  pass: "Pass",
  warn: "Review",
  fail: "Fail",
};

export const legal16Demo: Legal16Props = {
  score: 86,
  label: "Compliance score",
  summary: "GDPR & SOC 2 ready. 2 items need review.",
  items: [
    { name: "Data processing agreement", status: "pass" },
    { name: "Vendor subprocessor list", status: "pass" },
    { name: "Breach notification SLA", status: "warn" },
    { name: "Retention policy", status: "warn" },
  ],
};

export function Legal16({
  score = 0,
  label = "Compliance score",
  summary,
  items = [],
  className,
}: Legal16Props) {
  const pct = Math.max(0, Math.min(100, score));

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {label}
          </span>
          <span className="font-mono text-xl font-bold text-card-foreground">
            {pct}
            <span className="text-xs font-normal text-muted-foreground">
              {" "}
              / 100
            </span>
          </span>
        </div>
        <div
          className="h-1.5 overflow-hidden rounded-full bg-muted"
          aria-hidden="true"
        >
          <div
            className="h-full rounded-full bg-emerald-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        {summary && (
          <span className="text-sm text-card-foreground">{summary}</span>
        )}
        <div className="flex flex-col gap-0.5 border-t border-border pt-2">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm">
              <span
                className={cn(
                  "size-1.5 shrink-0 rounded-full",
                  statusDot[item.status]
                )}
                aria-hidden="true"
              />
              <span className="flex-1 truncate text-card-foreground">
                {item.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {statusLabel[item.status]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

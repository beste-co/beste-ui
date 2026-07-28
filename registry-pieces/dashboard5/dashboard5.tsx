"use client";

import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "violet"
  | "emerald"
  | "sky"
  | "amber";

interface Dashboard5Item {
  label: string;
  value: number;
}

interface Dashboard5Props {
  title?: string;
  items?: Dashboard5Item[];
  format?: (n: number) => string;
  tone?: Tone;
  className?: string;
}

const barClasses: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  violet: "bg-violet-500 text-white",
  emerald: "bg-emerald-500 text-white",
  sky: "bg-sky-500 text-white",
  amber: "bg-amber-500 text-white",
};

export const dashboard5Demo: Dashboard5Props = {
  title: "Top sources",
  items: [
    { label: "Direct", value: 4820 },
    { label: "Google", value: 3610 },
    { label: "Twitter", value: 1890 },
    { label: "Referral", value: 980 },
  ],
  tone: "violet",
};

function Row({
  rank,
  label,
  value,
  inverted,
}: {
  rank: number;
  label: string;
  value: string;
  inverted?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-2 px-2 py-1 text-xs">
      <div className="flex min-w-0 items-center gap-2">
        <span
          className={cn(
            "w-3 shrink-0 text-right font-mono",
            inverted ? "opacity-70" : "text-muted-foreground"
          )}
        >
          {rank}
        </span>
        <span className="truncate font-medium">{label}</span>
      </div>
      <span className="shrink-0 font-mono tabular-nums">{value}</span>
    </div>
  );
}

export function Dashboard5({
  title = "Top items",
  items = [],
  format = (n: number) => n.toLocaleString(),
  tone = "violet",
  className,
}: Dashboard5Props) {
  const max = Math.max(...items.map((i) => i.value), 1);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-md border border-border bg-card p-3 shadow-sm">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </span>
        <div className="flex flex-col gap-1.5">
          {items.map((it, i) => {
            const pct = (it.value / max) * 100;
            const formatted = format(it.value);
            return (
              <div key={it.label} className="relative">
                <div className="rounded-sm bg-muted text-card-foreground">
                  <Row
                    rank={i + 1}
                    label={it.label}
                    value={formatted}
                  />
                </div>
                <div
                  className={cn(
                    "pointer-events-none absolute inset-0 rounded-sm",
                    barClasses[tone]
                  )}
                  style={{
                    clipPath: `inset(0 ${100 - pct}% 0 0)`,
                  }}
                  aria-hidden="true"
                >
                  <Row
                    rank={i + 1}
                    label={it.label}
                    value={formatted}
                    inverted
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

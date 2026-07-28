"use client";

import { cn } from "@/lib/utils";

type SpanTone = "sky" | "emerald" | "violet" | "amber" | "rose";

interface Span {
  label: string;
  start: number;
  width: number;
  tone: SpanTone;
}

interface Monitoring15Props {
  spans?: Span[];
  className?: string;
}

const spanClasses: Record<SpanTone, string> = {
  sky: "bg-sky-500",
  emerald: "bg-emerald-500",
  violet: "bg-violet-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
};

const defaultSpans: Span[] = [
  { label: "http.req", start: 0, width: 100, tone: "sky" },
  { label: "auth", start: 4, width: 14, tone: "violet" },
  { label: "db.query", start: 22, width: 48, tone: "emerald" },
  { label: "cache.set", start: 76, width: 12, tone: "amber" },
];

export const monitoring15Demo: Monitoring15Props = {
  spans: defaultSpans,
};

export function Monitoring15({
  spans = defaultSpans,
  className,
}: Monitoring15Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="grid w-full max-w-72 grid-cols-[auto_1fr] items-center gap-x-3 gap-y-1.5 rounded-lg border border-border bg-card px-3 py-2.5 shadow-sm">
        {spans.map((span) => (
          <div key={span.label} className="contents">
            <span className="font-mono text-xs text-muted-foreground">
              {span.label}
            </span>
            <div className="relative h-2" aria-hidden="true">
              <span
                className={cn(
                  "absolute h-full rounded-sm",
                  spanClasses[span.tone]
                )}
                style={{
                  left: `${span.start}%`,
                  width: `${span.width}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

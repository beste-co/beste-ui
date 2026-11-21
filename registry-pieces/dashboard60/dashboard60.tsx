"use client";

import { cn } from "@/lib/utils";

interface Dashboard60Row {
  label: string;
  value: string;
  /** The value in orange, e.g. a call to action */
  accent?: boolean;
}

interface Dashboard60Props {
  title?: string;
  meta?: string;
  /** Three rows that a soft highlight reads through in turn */
  rows?: Dashboard60Row[];
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot's width instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const dashboard60Demo: Dashboard60Props = {
  title: "Riverside Physio",
  rows: [
    { label: "We treat", value: "Back, neck and sports injuries" },
    { label: "Open", value: "Mon to Thu, 8 to 18" },
    { label: "Reach us", value: "Book a first visit", accent: true },
  ],
  framed: true,
};

// One hold per shown row, then back to the top; 4s per row
function styles(count: number) {
  if (count < 2) return "";
  const slot = 96 / count;
  const pct = (value: number) => `${Math.round(value * 100) / 100}%`;
  const stops = Array.from({ length: count }, (_, index) => {
    const transform = index === 0 ? "none" : `translateY(${index * 100}%)`;
    return `${pct(index * slot)}, ${pct(index * slot + slot * 0.75)} { transform: ${transform} }`;
  }).join(" ");
  return `
@keyframes dashboard60-scan { ${stops} 96%, 100% { transform: none } }
.dashboard60-scan { animation: dashboard60-scan ${count * 4}s cubic-bezier(.45,0,.25,1) infinite }
@media (prefers-reduced-motion: reduce) { .dashboard60-scan { animation: none } }
`;
}

export function Dashboard60({ title, meta, rows = [], framed = true, fill = false, className }: Dashboard60Props) {
  const shown = rows.slice(0, 3);
  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <style>{styles(shown.length)}</style>
      <div
        className={cn(
          "w-full",
          !fill && "max-w-68",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div className={cn("rounded-2xl bg-card px-2.5 py-3 text-card-foreground", !framed && "shadow-lg")}>
          <div className="flex items-baseline justify-between gap-3 px-2.5 pb-2.5">
            <span className="truncate text-sm font-medium">{title}</span>
            {meta && <span className="shrink-0 text-xs text-muted-foreground/80">{meta}</span>}
          </div>
          <div className="relative border-t border-border pt-1.5">
            {shown.length > 0 && <span aria-hidden="true" className="dashboard60-scan absolute inset-x-0 top-1.5 h-8.25 rounded-lg bg-muted" />}
            {shown.map((row, index) => (
              <div key={index} className="relative flex h-8.25 items-center justify-between gap-3 px-2.5 text-xs">
                <span className="shrink-0 text-muted-foreground">{row.label}</span>
                <span className={cn("truncate", row.accent ? "text-chart-1" : "text-foreground")}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

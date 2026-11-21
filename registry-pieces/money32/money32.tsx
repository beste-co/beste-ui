"use client";

import { cn } from "@/lib/utils";

interface Money32Row {
  name: string;
  values: [string, string];
}

interface Money32Props {
  title?: string;
  columns?: [string, string];
  rows?: Money32Row[];
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  className?: string;
}

export const money32Demo: Money32Props = {
  title: "Treatments",
  columns: ["Single", "Course of 3"],
  rows: [
    { name: "Signature facial", values: ["€85", "€230"] },
    { name: "Calming peel", values: ["€70", "€190"] },
    { name: "Brow shaping", values: ["€30", "€80"] },
  ],
  framed: true,
};

const STYLES = `
@keyframes money32-a { 0%, 40% { opacity: 1; } 48%, 90% { opacity: 0; } 98%, 100% { opacity: 1; } }
@keyframes money32-b { 0%, 40% { opacity: 0; } 48%, 90% { opacity: 1; } 98%, 100% { opacity: 0; } }
.money32-a { animation: money32-a 12s ease infinite; }
.money32-b { opacity: 0; animation: money32-b 12s ease infinite; }
@media (prefers-reduced-motion: reduce) {
  .money32-a, .money32-b { animation: none; }
  .money32-a { opacity: 0; }
  .money32-b { opacity: 1; }
}
`;

export function Money32({ title, columns = ["", ""], rows = [], framed = true, className }: Money32Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <style>{STYLES}</style>

      <div
        className={cn(
          "w-66",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div className={cn("relative rounded-2xl bg-card px-2.5 pb-1.5 pt-2 text-xs text-card-foreground", !framed && "shadow-lg")}>
          <span className="money32-a absolute inset-y-1.5 right-20.5 w-16 rounded-lg bg-muted" aria-hidden="true" />
          <span className="money32-b absolute inset-y-1.5 right-2.5 w-18 rounded-lg bg-accent" aria-hidden="true" />

          <div className="relative">
            <div className="flex h-6 items-center text-muted-foreground">
              <span className="min-w-0 flex-1 truncate pl-1 font-semibold text-foreground">{title}</span>
              <span className="w-16 text-center">{columns[0]}</span>
              <span className="w-18 truncate text-center">{columns[1]}</span>
            </div>
            {rows.map((row) => (
              <div key={row.name} className="flex h-6 items-center border-t border-border">
                <span className="min-w-0 flex-1 truncate pl-1">{row.name}</span>
                <span className="w-16 text-center tabular-nums">{row.values[0]}</span>
                <span className="w-18 text-center tabular-nums">{row.values[1]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

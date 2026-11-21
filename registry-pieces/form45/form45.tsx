"use client";

import { cn } from "@/lib/utils";

interface Form45Row {
  name?: string;
  /** Which form it came from */
  source?: string;
}

interface Form45Props {
  title?: string;
  badge?: string;
  rows?: Form45Row[];
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot it sits in instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const form45Demo: Form45Props = {
  title: "Submissions",
  badge: "3 new",
  rows: [
    { name: "Norah Jones", source: "Booking" },
    { name: "Jacob Collier", source: "Contact" },
    { name: "Laura Marling", source: "Popup" },
  ],
  framed: true,
};

const STYLES = `
@keyframes form45-row { 0% { opacity: 0; transform: translateY(-0.375rem); } 6%, 80% { opacity: 1; transform: none; } 88%, 100% { opacity: 0; transform: none; } }
.form45-row { opacity: 0; animation: form45-row 12s ease infinite; }
@media (prefers-reduced-motion: reduce) { .form45-row { animation: none; opacity: 1; } }
`;

export function Form45({ title, badge, rows = [], framed = true, fill = false, className }: Form45Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <style>{STYLES}</style>
      <div
        className={cn(
          "w-full",
          !fill && "max-w-72",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md",
        )}
      >
        <div
          className={cn(
            "flex flex-col rounded-2xl bg-card p-3 text-xs text-card-foreground",
            !framed && "shadow-lg",
          )}
        >
          <div className="flex justify-between gap-2 pb-2 text-sm font-semibold">
            {title}
            {badge && <span className="font-normal text-muted-foreground">{badge}</span>}
          </div>
          {rows.map((row, i) => (
            <div
              key={i}
              className="form45-row flex justify-between gap-2 border-t border-border py-2"
              // Rows arrive one by one, 1.2s apart, top row first
              style={{ animationDelay: `${-(rows.length - 1 - i) * 1.2}s` }}
            >
              <span className="truncate">{row.name}</span>
              <span className="shrink-0 text-muted-foreground">{row.source}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

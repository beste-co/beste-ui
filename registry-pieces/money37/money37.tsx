"use client";

import { cn } from "@/lib/utils";

interface Money37Row {
  label: string;
  value: string;
  /** The row being edited, ringed with a blinking caret after the value */
  focused?: boolean;
}

interface Money37Props {
  title?: string;
  meta?: string;
  rows?: Money37Row[];
  /** A green line at the foot */
  status?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Take the slot's full width instead of a card-sized box */
  fill?: boolean;
  className?: string;
}

export const money37Demo: Money37Props = {
  title: "Treatments",
  rows: [
    { label: "Calming facial", value: "€65" },
    { label: "Signature facial", value: "€85", focused: true },
    { label: "Renewal facial", value: "€110" },
  ],
  status: "Published",
  framed: true,
};

const STYLES = `
@keyframes money37-caret { 0%, 50% { opacity: 1 } 51%, 100% { opacity: 0 } }
.money37-caret { animation: money37-caret 1.1s steps(1) infinite }
@media (prefers-reduced-motion: reduce) { .money37-caret { animation: none } }
`;

export function Money37({ title, meta, rows = [], status, framed = true, fill = false, className }: Money37Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <style>{STYLES}</style>
      <div
        className={cn(
          "w-full",
          !fill && "max-w-75",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div className={cn("flex flex-col gap-3 rounded-2xl bg-card p-4 text-sm text-card-foreground", !framed && "shadow-lg")}>
          {(title || meta) && (
            <div className="flex items-baseline justify-between gap-3">
              <span className="truncate font-semibold">{title}</span>
              {meta && <span className="shrink-0 text-xs text-muted-foreground">{meta}</span>}
            </div>
          )}
          <div className="flex flex-col border-t border-border">
            {rows.map((row, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-center justify-between gap-3",
                  row.focused ? "-mx-2 my-1 rounded-lg bg-muted px-2 py-1.5 ring-1 ring-foreground/20" : "py-2.5",
                  !row.focused && index < rows.length - 1 && !rows[index + 1]?.focused && "border-b border-border",
                )}
              >
                <span className="truncate">{row.label}</span>
                <span className={cn("flex shrink-0 items-center", !row.focused && "text-muted-foreground")}>
                  {row.value}
                  {row.focused && <span aria-hidden="true" className="money37-caret ml-0.5 inline-block h-3.5 w-px bg-foreground" />}
                </span>
              </div>
            ))}
          </div>
          {status && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400">
              <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-current" />
              <span className="truncate">{status}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

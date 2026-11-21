"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Money33Row {
  label: string;
  value: string;
  /** Show the value as a small stone pill */
  pill?: boolean;
  /** A quiet line under the label */
  detail?: string;
  /** The row picked out on a soft tint, label and value in bold */
  highlight?: boolean;
}

interface Money33Props {
  title?: string;
  meta?: string;
  /** Ticked lines above the rows */
  points?: string[];
  rows?: Money33Row[];
  /** A quiet line under the rows */
  note?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot it sits in instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const money33Demo: Money33Props = {
  title: "AI credits",
  rows: [
    { label: "Monthly allowance", value: "3,000" },
    { label: "Used this month", value: "640" },
    { label: "Purchased credits", value: "Never expire", pill: true },
  ],
  framed: true,
};

export function Money33({ title, meta, points = [], rows = [], note, framed = true, fill = false, className }: Money33Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <div
        className={cn(
          "w-full",
          !fill && "max-w-90",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div className={cn("flex flex-col rounded-2xl bg-card p-4 text-xs text-card-foreground", !framed && "shadow-lg", fill && "justify-center")}>
          {(title || meta) && (
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="text-sm font-semibold">{title}</span>
              {meta && <span className="truncate text-muted-foreground">{meta}</span>}
            </div>
          )}
          {points.length > 0 && (
            <div className="mb-3 flex flex-col gap-2">
              {points.map((point, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Check aria-hidden="true" className="mt-px size-3.5 shrink-0" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          )}
          {rows.map((row, index) => (
            <div
              key={index}
              className={cn(
                "flex items-center justify-between gap-3 py-2.5",
                row.highlight ? "-mx-2.5 rounded-lg bg-muted px-2.5 font-semibold" : "border-t border-border",
                rows[index - 1]?.highlight && "border-t-0",
              )}
            >
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className={cn(row.highlight ? "text-foreground" : row.detail ? "text-foreground/85" : "text-muted-foreground")}>{row.label}</span>
                {row.detail && <span className="truncate font-normal text-muted-foreground">{row.detail}</span>}
              </span>
              {row.pill ? <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-muted-foreground">{row.value}</span> : <span className={cn("truncate", row.detail && !row.highlight && "text-muted-foreground")}>{row.value}</span>}
            </div>
          ))}
          {note && <div className="border-t border-border pt-2.5 text-muted-foreground">{note}</div>}
        </div>
      </div>
    </div>
  );
}

"use client";

import { Lock } from "lucide-react";

import { cn } from "@/lib/utils";

type Tone = "pill" | "plain" | "warning";

interface Dashboard59Row {
  time: string;
  title: string;
  detail?: string;
  place?: string;
  status?: string;
  /** A stone pill, quiet text, or an amber note for a change */
  tone?: Tone;
  /** The row on a soft highlight */
  active?: boolean;
}

interface Dashboard59Props {
  domain?: string;
  /** A green line on the right of the address bar */
  status?: string;
  eyebrow?: string;
  title?: string;
  days?: string[];
  /** The day shown as picked, by index */
  activeDay?: number;
  rows?: Dashboard59Row[];
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  className?: string;
}

export const dashboard59Demo: Dashboard59Props = {
  domain: "lisboncraftsummit.com/schedule",
  eyebrow: "Lisbon Craft Summit",
  title: "Schedule",
  days: ["Wed 14", "Thu 15", "Fri 16"],
  activeDay: 1,
  rows: [
    { time: "09:30", title: "Workshop track, morning", place: "Studios 1 to 4", status: "12 places left", tone: "pill" },
    { time: "11:30", title: "Hand-painted signs of the Baixa", place: "Main hall" },
    { time: "14:30", title: "Afternoon sessions", place: "Main hall", status: "Waiting list", tone: "pill" },
    { time: "16:30", title: "Panel with all speakers", place: "Studio 2", status: "Moved from Main hall", tone: "warning", active: true },
  ],
  framed: true,
};

const toneStyles: Record<Tone, string> = {
  pill: "rounded-full bg-muted px-2.5 py-0.5 text-foreground/75",
  plain: "text-muted-foreground",
  warning: "text-amber-700 dark:text-amber-400",
};

export function Dashboard59({ domain, status, eyebrow, title, days = [], activeDay = 0, rows = [], framed = true, className }: Dashboard59Props) {
  const hasPlace = rows.some((row) => row.place);
  const hasStatus = rows.some((row) => row.status);
  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <div
        className={cn(
          "w-full max-w-225",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div className={cn("overflow-hidden rounded-2xl bg-card text-sm text-card-foreground", !framed && "shadow-lg")}>
          <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3 text-xs">
            <span className="flex min-w-0 items-center gap-1.5 text-foreground/70">
              <Lock aria-hidden="true" className="size-3 shrink-0" />
              <span className="truncate">{domain}</span>
            </span>
            {status && <span className="shrink-0 text-emerald-700 dark:text-emerald-400">{status}</span>}
          </div>
          <div className="px-5 pt-6 pb-6 md:px-8 md:pt-7 md:pb-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                {eyebrow && <p className="text-xs text-muted-foreground">{eyebrow}</p>}
                {title && <p className="mt-1.5 text-3xl leading-tight font-medium tracking-tight">{title}</p>}
              </div>
              {days.length > 0 && (
                <div className="flex gap-1.5 text-xs">
                  {days.map((day, index) => (
                    <span key={index} className={cn("rounded-full px-3 py-1.5", index === activeDay ? "bg-muted text-foreground ring-1 ring-border" : "text-muted-foreground")}>
                      {day}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="mt-5.5 border-t border-border">
              {/* Columns stay in every row once any row uses them, so places and statuses line up */}
              {rows.map((row, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-center gap-4 py-3.5",
                    row.active ? "-mx-3 rounded-lg bg-muted px-3" : "border-b border-border",
                    rows[index + 1]?.active && "border-b-0",
                  )}
                >
                  <span className="w-12 shrink-0 text-muted-foreground tabular-nums md:w-16">{row.time}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{row.title}</span>
                    {row.detail && <span className="mt-0.5 block truncate text-xs text-muted-foreground">{row.detail}</span>}
                  </span>
                  {hasPlace && <span className="hidden w-37.5 shrink-0 truncate text-foreground/70 md:block">{row.place}</span>}
                  {hasStatus && (
                    <span className="flex shrink-0 justify-end md:w-40">
                      {row.status && <span className={cn("text-xs whitespace-nowrap", toneStyles[row.tone ?? "plain"])}>{row.status}</span>}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { cn } from "@/lib/utils";

type Tone =
  | "neutral"
  | "primary"
  | "foreground"
  | "sunset"
  | "ocean"
  | "violet";

interface Event1Props {
  eventName?: string;
  date?: string;
  venue?: string;
  section?: string;
  seat?: string;
  ticketCode?: string;
  sectionLabel?: string;
  seatLabel?: string;
  tone?: Tone;
  className?: string;
}

const cardClasses: Record<Tone, string> = {
  neutral: "border border-border bg-card text-card-foreground",
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  sunset: "bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 text-white",
  ocean: "bg-gradient-to-br from-sky-500 via-indigo-500 to-violet-500 text-white",
  violet: "bg-gradient-to-br from-violet-600 via-fuchsia-500 to-rose-500 text-white",
};

export const event1Demo: Event1Props = {
  eventName: "Midnight Tape · Live",
  date: "Sat, Jun 14 · 21:00",
  venue: "Zorlu PSM · Istanbul",
  section: "GA Floor",
  seat: "A · 042",
  ticketCode: "MT-7Z91-X2Q",
  sectionLabel: "Section",
  seatLabel: "Seat",
  tone: "neutral",
};

export function Event1({
  eventName,
  date,
  venue,
  section,
  seat,
  ticketCode,
  sectionLabel = "Section",
  seatLabel = "Seat",
  tone = "neutral",
  className,
}: Event1Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className={cn(
          "relative flex w-full max-w-80 overflow-hidden rounded-xl shadow-xl",
          cardClasses[tone]
        )}
      >
        <span
          className="absolute left-0 top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-background"
          aria-hidden="true"
        />
        <span
          className="absolute right-0 top-1/2 size-4 -translate-y-1/2 translate-x-1/2 rounded-full bg-background"
          aria-hidden="true"
        />
        <div className="flex-1 p-3">
          {eventName && (
            <span className="block text-lg font-bold leading-tight">
              {eventName}
            </span>
          )}
          {date && (
            <span className="block text-sm opacity-85">{date}</span>
          )}
          {venue && (
            <span className="block text-xs opacity-70">{venue}</span>
          )}
          <div className="mt-2 flex items-center gap-3 text-xs">
            <div className="flex flex-col">
              <span className="opacity-60">{sectionLabel}</span>
              <span className="font-mono font-semibold">{section}</span>
            </div>
            <div className="flex flex-col">
              <span className="opacity-60">{seatLabel}</span>
              <span className="font-mono font-semibold">{seat}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center border-l border-dashed border-current/30 px-3">
          <span
            className="font-mono text-xs font-semibold uppercase tracking-widest"
            style={{ writingMode: "vertical-rl" }}
          >
            {ticketCode}
          </span>
        </div>
      </div>
    </div>
  );
}

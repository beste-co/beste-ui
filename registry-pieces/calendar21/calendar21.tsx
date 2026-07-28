"use client";

import { cn } from "@/lib/utils";

interface Calendar21Props {
  title?: string;
  confirmation?: string;
  partySize?: string;
  checkIn?: string;
  checkOut?: string;
  total?: string;
  status?: "confirmed" | "pending" | "cancelled";
  className?: string;
}

const statusClasses: Record<
  "confirmed" | "pending" | "cancelled",
  { pill: string; label: string }
> = {
  confirmed: {
    pill: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
    label: "Confirmed",
  },
  pending: {
    pill: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
    label: "Awaiting host",
  },
  cancelled: {
    pill: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
    label: "Cancelled",
  },
};

export const calendar21Demo: Calendar21Props = {
  title: "Casa Mariposa · Lisbon",
  confirmation: "Booking #A-7812-55",
  partySize: "2 guests",
  checkIn: "Jun 14 · After 16:00",
  checkOut: "Jun 18 · Before 11:00",
  total: "€736 · 4 nights",
  status: "confirmed",
};

export function Calendar21({
  title,
  confirmation,
  partySize,
  checkIn,
  checkOut,
  total,
  status = "confirmed",
  className,
}: Calendar21Props) {
  const s = statusClasses[status];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 flex-1 flex-col">
            {title && (
              <span className="truncate text-sm font-semibold text-card-foreground">
                {title}
              </span>
            )}
            {confirmation && (
              <span className="truncate font-mono text-xs text-muted-foreground">
                {confirmation}
              </span>
            )}
          </div>
          <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold", s.pill)}>
            {s.label}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 rounded-md bg-muted/60 p-2 text-xs">
          <div className="flex flex-col">
            <span className="text-muted-foreground">Check-in</span>
            <span className="font-semibold text-card-foreground">{checkIn}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">Check-out</span>
            <span className="font-semibold text-card-foreground">{checkOut}</span>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-border pt-2 text-xs">
          {partySize && (
            <span className="text-muted-foreground">{partySize}</span>
          )}
          {total && (
            <span className="font-mono text-sm font-bold text-card-foreground">
              {total}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

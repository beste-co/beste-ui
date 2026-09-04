"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, ScanLine } from "lucide-react";
import { cn } from "@/lib/utils";

interface Ticket11Props {
  eventName?: string;
  venue?: string;
  seat?: string;
  holder?: string;
  scanMs?: number;
  holdMs?: number;
  className?: string;
}

export const ticket11Demo: Ticket11Props = {
  eventName: "Blue Note Sessions",
  venue: "Sat 12 Oct, 20:30",
  seat: "Row C, Seat 14",
  holder: "Erykah Badu",
};

const BARS = [1, 2, 1, 3, 1, 1, 2, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1, 1, 3, 1, 2, 2, 1, 3];

const barWidths: Record<number, string> = {
  1: "w-0.5",
  2: "w-1",
  3: "w-1.5",
};

export function Ticket11({
  eventName = "Event",
  venue,
  seat,
  holder,
  scanMs = 2000,
  holdMs = 2400,
  className,
}: Ticket11Props) {
  const [valid, setValid] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setValid((v) => !v), valid ? holdMs : scanMs);
    return () => clearTimeout(id);
  }, [valid, scanMs, holdMs]);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <style>{`
@keyframes ticket11-scan { from { transform: translateY(0); } to { transform: translateY(2.375rem); } }
@keyframes ticket11-in { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: none; } }
`}</style>

      <div className="w-full max-w-64 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-1 p-4">
          <p className="text-sm font-medium text-card-foreground">
            {eventName}
          </p>
          {venue && <p className="text-xs text-muted-foreground">{venue}</p>}
          <div className="mt-1 flex items-baseline justify-between text-xs">
            {seat && <span className="text-card-foreground">{seat}</span>}
            {holder && <span className="text-muted-foreground">{holder}</span>}
          </div>
        </div>

        <div className="flex items-center gap-1" aria-hidden="true">
          <span className="size-3 shrink-0 -translate-x-1.5 rounded-full bg-background" />
          <span className="h-px flex-1 border-t border-dashed border-border" />
          <span className="size-3 shrink-0 translate-x-1.5 rounded-full bg-background" />
        </div>

        <div className="p-4">
          <div className="relative mx-auto h-10 w-4/5 overflow-hidden rounded-md bg-muted">
            <div className="flex h-full items-center justify-center gap-1 px-3">
              {BARS.map((w, i) => (
                <span
                  key={i}
                  className={cn("h-5 rounded-full bg-foreground", barWidths[w])}
                  aria-hidden="true"
                />
              ))}
            </div>

            {!valid && (
              <span
                className="absolute inset-x-0 top-0 h-0.5 bg-sky-500"
                style={{
                  animation: "ticket11-scan 1200ms ease-in-out infinite alternate",
                }}
                aria-hidden="true"
              />
            )}

            {valid && (
              <div
                className="absolute inset-0 flex items-center justify-center gap-1.5 bg-card"
                style={{ animation: "ticket11-in 350ms ease-out" }}
              >
                <CheckCircle2
                  className="size-4 text-emerald-500"
                  aria-hidden="true"
                />
                <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  Checked in
                </span>
              </div>
            )}
          </div>

          <p className="mt-2 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <ScanLine className="size-3.5" aria-hidden="true" />
            {valid ? "Enjoy the show" : "Hold the code under the scanner"}
          </p>
        </div>
      </div>
    </div>
  );
}

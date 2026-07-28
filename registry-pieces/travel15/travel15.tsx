"use client";

import { IdCard } from "lucide-react";
import { cn } from "@/lib/utils";

interface Travel15Props {
  name?: string;
  passportNo?: string;
  nationality?: string;
  frequentFlyer?: string;
  birthDate?: string;
  seat?: string;
  className?: string;
}

export const travel15Demo: Travel15Props = {
  name: "Oud Beste",
  passportNo: "TR P 284 911 58",
  nationality: "Türkiye",
  frequentFlyer: "Elite Gold · 284 519",
  birthDate: "1991-08-19",
  seat: "12D",
};

export function Travel15({
  name,
  passportNo,
  nationality,
  frequentFlyer,
  birthDate,
  seat,
  className,
}: Travel15Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-md bg-slate-900 text-slate-100 dark:bg-slate-100 dark:text-slate-900">
              <IdCard className="size-4" aria-hidden="true" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Passenger info
            </span>
          </div>
          {seat && (
            <span className="rounded-md bg-muted px-2 py-0.5 font-mono text-xs font-semibold text-card-foreground">
              Seat {seat}
            </span>
          )}
        </div>
        <span className="text-sm font-semibold text-card-foreground">
          {name}
        </span>
        <div className="grid grid-cols-2 gap-1 text-xs">
          <div className="flex flex-col">
            <span className="text-muted-foreground">Passport</span>
            <span className="font-mono text-card-foreground">
              {passportNo}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">Nationality</span>
            <span className="text-card-foreground">{nationality}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">DOB</span>
            <span className="font-mono text-card-foreground">{birthDate}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">FF status</span>
            <span className="truncate text-card-foreground">
              {frequentFlyer}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

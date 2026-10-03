"use client";

import { cn } from "@/lib/utils";

interface Travel15Props {
  name?: string;
  passportNo?: string;
  nationality?: string;
  frequentFlyer?: string;
  birthDate?: string;
  seat?: string;
  bordered?: boolean;
  className?: string;
}

export const travel15Demo: Travel15Props = {
  name: "Ólafur Arnalds",
  passportNo: "A 284 911 58",
  nationality: "Iceland",
  bordered: false,
};

export function Travel15({
  name,
  passportNo,
  nationality,
  frequentFlyer,
  birthDate,
  seat,
  bordered = false,
  className,
}: Travel15Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-xl bg-card p-3 shadow-sm", bordered && "border border-border")}>
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-sm font-semibold text-card-foreground">
            {name}
          </span>
          {seat && (
            <span className="shrink-0 rounded-md bg-muted px-2 py-0.5 text-xs font-semibold text-card-foreground">
              Seat {seat}
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {passportNo && (
            <div className="flex flex-col">
              <span className="text-muted-foreground">Passport</span>
              <span className="tabular-nums text-card-foreground">
                {passportNo}
              </span>
            </div>
          )}
          {nationality && (
            <div className="flex flex-col">
              <span className="text-muted-foreground">Nationality</span>
              <span className="text-card-foreground">{nationality}</span>
            </div>
          )}
          {birthDate && (
            <div className="flex flex-col">
              <span className="text-muted-foreground">Date of birth</span>
              <span className="tabular-nums text-card-foreground">
                {birthDate}
              </span>
            </div>
          )}
          {frequentFlyer && (
            <div className="flex flex-col">
              <span className="text-muted-foreground">Loyalty</span>
              <span className="truncate text-card-foreground">
                {frequentFlyer}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { PenLine } from "lucide-react";
import { cn } from "@/lib/utils";

interface Legal2Props {
  label?: string;
  name?: string;
  role?: string;
  dateLine?: string;
  className?: string;
}

export const legal2Demo: Legal2Props = {
  label: "Sign here",
  name: "Beste Sözen",
  role: "Principal, Beste Design Studio",
  dateLine: "Date: __ / __ / ____",
};

export function Legal2({
  label = "Sign here",
  name,
  role,
  dateLine = "Date: __ / __ / ____",
  className,
}: Legal2Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-lg border border-border bg-card p-4 shadow-sm">
        <div className="relative flex h-20 items-end border-b-2 border-dashed border-muted-foreground/40 px-2 pb-1">
          <span
            className="absolute -left-1 -top-1 -rotate-12 rounded-md bg-rose-500 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-white shadow-sm"
            aria-hidden="true"
          >
            <PenLine
              className="mr-1 inline-block size-3"
              aria-hidden="true"
            />
            {label}
          </span>
          <span className="text-muted-foreground/40">×</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <div className="flex flex-col">
            {name && (
              <span className="font-medium text-card-foreground">{name}</span>
            )}
            {role && (
              <span className="text-muted-foreground">{role}</span>
            )}
          </div>
          <span className="font-mono text-muted-foreground">{dateLine}</span>
        </div>
      </div>
    </div>
  );
}

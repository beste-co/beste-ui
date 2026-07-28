"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

interface Shapes61Props {
  className?: string;
}

export const shapes61Demo: Shapes61Props = {};

export function Shapes61({ className }: Shapes61Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className="flex w-44 flex-col divide-y divide-border rounded-md border border-border bg-card"
        aria-hidden="true"
      >
        <div className="flex items-center gap-2.5 px-3 py-2.5">
          <Mail className="size-3.5 shrink-0 text-muted-foreground" />
          <div className="flex flex-1 flex-col gap-1">
            <span className="h-1 w-10 rounded-full bg-muted" />
            <span className="h-1.5 w-20 rounded-full bg-foreground/70" />
          </div>
        </div>
        <div className="flex items-center gap-2.5 px-3 py-2.5">
          <Phone className="size-3.5 shrink-0 text-muted-foreground" />
          <div className="flex flex-1 flex-col gap-1">
            <span className="h-1 w-10 rounded-full bg-muted" />
            <span className="h-1.5 w-16 rounded-full bg-foreground/70" />
          </div>
        </div>
        <div className="flex items-center gap-2.5 px-3 py-2.5">
          <MapPin className="size-3.5 shrink-0 text-muted-foreground" />
          <div className="flex flex-1 flex-col gap-1">
            <span className="h-1 w-10 rounded-full bg-muted" />
            <span className="h-1.5 w-24 rounded-full bg-foreground/70" />
          </div>
        </div>
      </div>
    </div>
  );
}

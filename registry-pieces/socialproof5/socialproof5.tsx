"use client";

import { cn } from "@/lib/utils";

interface Socialproof5Props {
  title?: string;
  period?: string;
  bordered?: boolean;
  className?: string;
}

export const socialproof5Demo: Socialproof5Props = {
  title: "Leader in Collaboration Tools",
  period: "Winter 2025",
  bordered: false,
};

export function Socialproof5({
  title = "Award",
  period,
  bordered = false,
  className,
}: Socialproof5Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("inline-flex items-center gap-2.5 rounded-full bg-card px-3 py-1.5 shadow-sm", bordered && "border border-border")}>
        <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-amber-400 text-xs font-bold text-amber-900">
          ★
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-xs font-semibold text-card-foreground">
            {title}
          </span>
          {period && (
            <span className="text-xs text-muted-foreground">{period}</span>
          )}
        </div>
      </div>
    </div>
  );
}

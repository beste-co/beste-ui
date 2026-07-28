"use client";

import { cn } from "@/lib/utils";

interface Socialproof6Props {
  label?: string;
  outlets?: string[];
  className?: string;
}

export const socialproof6Demo: Socialproof6Props = {
  label: "As featured in",
  outlets: ["Techcrunch", "Forbes", "Wired", "The Verge"],
};

export function Socialproof6({
  label,
  outlets = [],
  className,
}: Socialproof6Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col items-center gap-3">
        {label && (
          <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {label}
          </span>
        )}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {outlets.map((o, i) => (
            <span
              key={i}
              className="text-sm font-semibold tracking-tight text-muted-foreground"
            >
              {o}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

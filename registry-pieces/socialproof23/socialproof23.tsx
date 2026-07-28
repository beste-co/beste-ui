"use client";

import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface BadgeItem {
  label: string;
}

interface Socialproof23Props {
  caption?: string;
  badges?: BadgeItem[];
  className?: string;
}

export const socialproof23Demo: Socialproof23Props = {
  caption: "Certified and compliant",
  badges: [
    { label: "SOC 2 Type II" },
    { label: "GDPR" },
    { label: "ISO 27001" },
    { label: "HIPAA" },
  ],
};

export function Socialproof23({
  caption,
  badges = [],
  className,
}: Socialproof23Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col items-center gap-4">
        {caption && (
          <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {caption}
          </span>
        )}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {badges.map((badge, index) => (
            <div
              key={index}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 shadow-sm"
            >
              <ShieldCheck
                className="size-3.5 text-muted-foreground"
                aria-hidden="true"
              />
              <span className="text-xs font-semibold text-card-foreground">
                {badge.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import type { LucideIcon } from "lucide-react";
import { Headset, Lock, RotateCcw, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

type Badge = "secure" | "returns" | "authentic" | "support";

interface Commerce16Badge {
  kind: Badge;
  label: string;
  hint?: string;
}

interface Commerce16Props {
  badges?: Commerce16Badge[];
  bordered?: boolean;
  className?: string;
}

const BADGES: Record<Badge, LucideIcon> = {
  secure: Lock,
  returns: RotateCcw,
  authentic: ShieldCheck,
  support: Headset,
};

export const commerce16Demo: Commerce16Props = {
  badges: [
    { kind: "secure", label: "Secure checkout" },
    { kind: "returns", label: "Free returns" },
    { kind: "authentic", label: "Authentic" },
    { kind: "support", label: "24/7 support" },
  ],
  bordered: false,
};

export function Commerce16({ badges = [], bordered = false, className }: Commerce16Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="grid w-full max-w-80 grid-cols-2 gap-2">
        {badges.map((b) => {
          const Icon = BADGES[b.kind];
          return (
            <div
              key={b.kind}
              className={cn("flex items-center gap-2 rounded-md bg-card p-2.5 shadow-sm", bordered && "border border-border")}
            >
              <Icon
                className="size-4 shrink-0 text-foreground"
                aria-hidden="true"
              />
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-xs font-semibold text-card-foreground">
                  {b.label}
                </span>
                {b.hint && (
                  <span className="truncate text-xs text-muted-foreground">
                    {b.hint}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

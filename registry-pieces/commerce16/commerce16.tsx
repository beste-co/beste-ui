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
    { kind: "secure", label: "Secure checkout", hint: "256-bit SSL" },
    { kind: "returns", label: "Free returns", hint: "30 days" },
    { kind: "authentic", label: "Authentic", hint: "Brand-verified" },
    { kind: "support", label: "24/7 support", hint: "Chat or email" },
  ],
};

export function Commerce16({ badges = [], className }: Commerce16Props) {
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
              className="flex items-center gap-2 rounded-md border border-border bg-card p-2.5 shadow-sm"
            >
              <span
                className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-foreground"
                aria-hidden="true"
              >
                <Icon className="size-3.5" />
              </span>
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

"use client";

import { useEffect, useState } from "react";
import { BellRing, ClipboardList, Flame, Utensils } from "lucide-react";
import { cn } from "@/lib/utils";

interface Item {
  name: string;
  qty?: number;
}

interface Food11Props {
  orderLabel?: string;
  tableLabel?: string;
  items?: Item[];
  stepMs?: number;
  holdMs?: number;
  className?: string;
}

type Stage = "received" | "cooking" | "plating" | "ready";

const ORDER: Stage[] = ["received", "cooking", "plating", "ready"];

const STAGES: Record<Stage, { label: string; icon: typeof Flame; pill: string }> = {
  received: {
    label: "Received",
    icon: ClipboardList,
    pill: "bg-muted text-muted-foreground",
  },
  cooking: {
    label: "Cooking",
    icon: Flame,
    pill: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  plating: {
    label: "Plating",
    icon: Utensils,
    pill: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  },
  ready: {
    label: "Ready",
    icon: BellRing,
    pill: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
};

export const food11Demo: Food11Props = {
  orderLabel: "Order #1284",
  tableLabel: "Table 6",
  items: [
    { name: "Miso ramen", qty: 2 },
    { name: "Gyoza", qty: 1 },
    { name: "Iced matcha", qty: 2 },
  ],
};

export function Food11({
  orderLabel = "Order",
  tableLabel,
  items = [],
  stepMs = 1500,
  holdMs = 2600,
  className,
}: Food11Props) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const last = stage === ORDER.length - 1;
    const id = setTimeout(
      () => setStage((s) => (s + 1) % ORDER.length),
      last ? holdMs : stepMs
    );
    return () => clearTimeout(id);
  }, [stage, stepMs, holdMs]);

  const current = STAGES[ORDER[stage] ?? "received"];
  const Icon = current.icon;

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <style>{`
@keyframes food11-steam { 0% { opacity: 0; transform: translateY(0.25rem) scaleX(1); } 40% { opacity: 0.9; } 100% { opacity: 0; transform: translateY(-0.75rem) scaleX(1.4); } }
@keyframes food11-pop { from { opacity: 0; transform: translateY(0.25rem); } to { opacity: 1; transform: none; } }
`}</style>

      <div className="flex w-full max-w-64 flex-col items-center gap-3 text-center">
        <span className="relative flex size-12 items-center justify-center rounded-xl bg-muted text-card-foreground">
          {stage === 1 && (
            <span className="absolute -top-1.5 flex gap-1" aria-hidden="true">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-2.5 w-0.5 rounded-full bg-muted-foreground"
                  style={{
                    animation: `food11-steam 1400ms ease-out ${i * 240}ms infinite`,
                  }}
                />
              ))}
            </span>
          )}
          <Icon key={stage} className="size-6" aria-hidden="true" />
        </span>

        <div>
          <p className="text-sm font-medium text-foreground">{orderLabel}</p>
          {tableLabel && (
            <p className="text-xs text-muted-foreground">{tableLabel}</p>
          )}
        </div>

        <span
          key={`pill-${stage}`}
          className={cn(
            "rounded-full px-2.5 py-0.5 text-xs font-medium",
            current.pill
          )}
          style={{ animation: "food11-pop 400ms ease-out" }}
        >
          {current.label}
        </span>

        <ul className="flex flex-col gap-0.5 text-sm text-muted-foreground">
          {items.map((item) => (
            <li key={item.name}>
              {item.name} x{item.qty ?? 1}
            </li>
          ))}
        </ul>

        <div className="flex w-32 gap-1.5" aria-hidden="true">
          {ORDER.map((key, i) => (
            <span
              key={key}
              className={cn(
                "h-1 flex-1 rounded-full transition-colors duration-500 motion-reduce:transition-none",
                i <= stage ? "bg-foreground" : "bg-muted"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

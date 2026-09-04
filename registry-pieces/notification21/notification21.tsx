"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  CalendarDays,
  CreditCard,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Kind = "message" | "calendar" | "payment" | "alert";

interface Item {
  title: string;
  body: string;
  kind?: Kind;
}

interface Notification21Props {
  items?: Item[];
  intervalMs?: number;
  className?: string;
}

interface Entry {
  id: number;
  item: Item;
}

const icons: Record<Kind, typeof MessageSquare> = {
  message: MessageSquare,
  calendar: CalendarDays,
  payment: CreditCard,
  alert: AlertTriangle,
};

const tileClasses: Record<Kind, string> = {
  message: "bg-sky-500 text-white",
  calendar: "bg-violet-500 text-white",
  payment: "bg-emerald-500 text-white",
  alert: "bg-amber-500 text-white",
};

const offsets = ["translateY(0) scale(1)", "translateY(0.5rem) scale(0.95)", "translateY(1rem) scale(0.9)"];
const opacities = ["opacity-100", "opacity-60", "opacity-30"];

export const notification21Demo: Notification21Props = {
  items: [
    { kind: "message", title: "Nina Simone", body: "Can you review the chorus mix before tonight?" },
    { kind: "payment", title: "Payment received", body: "$1,240.00 from Miles Davis" },
    { kind: "calendar", title: "Rehearsal in 10 min", body: "Studio B, with Björk and Prince" },
    { kind: "alert", title: "Build failed", body: "main: 2 tests failing in checkout" },
    { kind: "message", title: "Patti Smith", body: "Loved the new arrangement, sending notes" },
  ],
};

export function Notification21({
  items = [],
  intervalMs = 2200,
  className,
}: Notification21Props) {
  const [stack, setStack] = useState<Entry[]>(() =>
    items.length ? [{ id: 0, item: items[0] }] : []
  );

  useEffect(() => {
    if (items.length <= 1) return;
    const id = setInterval(() => {
      setStack((prev) => {
        const nextId = (prev[0]?.id ?? -1) + 1;
        return [{ id: nextId, item: items[nextId % items.length] }, ...prev].slice(0, 3);
      });
    }, intervalMs);
    return () => clearInterval(id);
  }, [items, intervalMs]);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <style>{`@keyframes notification21-in { from { opacity: 0; transform: translateY(-0.75rem); } to { opacity: 1; transform: none; } }`}</style>
      <div className="relative h-20 w-full max-w-72">
        {stack.map((entry, index) => {
          const kind = entry.item.kind ?? "message";
          const Icon = icons[kind];
          return (
            <div
              key={entry.id}
              className={cn(
                "absolute inset-x-0 top-0 transition-all duration-500 ease-out motion-reduce:transition-none",
                opacities[index] ?? "opacity-0"
              )}
              style={{ transform: offsets[index] ?? offsets[2], zIndex: 3 - index }}
            >
              <div
                className="flex items-start gap-2.5 rounded-xl border border-border bg-card p-2.5 shadow-md"
                style={{ animation: "notification21-in 450ms ease-out" }}
              >
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-lg",
                    tileClasses[kind]
                  )}
                  aria-hidden="true"
                >
                  <Icon className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="truncate text-sm font-medium text-card-foreground">
                      {entry.item.title}
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground">now</span>
                  </div>
                  <p className="truncate text-xs text-muted-foreground">
                    {entry.item.body}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

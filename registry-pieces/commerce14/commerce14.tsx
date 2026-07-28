"use client";

import type { LucideIcon } from "lucide-react";
import { Plane, Truck, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "primary" | "foreground" | "violet" | "emerald" | "sky" | "amber";

type Icon = "truck" | "plane" | "bolt";

interface Commerce14Method {
  label: string;
  eta: string;
  price: string;
  icon?: Icon;
}

interface Commerce14Props {
  methods?: Commerce14Method[];
  selected?: string;
  tone?: Tone;
  className?: string;
}

const ICONS: Record<Icon, LucideIcon> = {
  truck: Truck,
  plane: Plane,
  bolt: Zap,
};

const selectedBorder: Record<Tone, string> = {
  primary: "border-primary bg-primary/5",
  foreground: "border-foreground bg-foreground/5",
  violet: "border-violet-500 bg-violet-500/5",
  emerald: "border-emerald-500 bg-emerald-500/5",
  sky: "border-sky-500 bg-sky-500/5",
  amber: "border-amber-500 bg-amber-500/5",
};

const radioDot: Record<Tone, string> = {
  primary: "bg-primary",
  foreground: "bg-foreground",
  violet: "bg-violet-500",
  emerald: "bg-emerald-500",
  sky: "bg-sky-500",
  amber: "bg-amber-500",
};

const radioBorder: Record<Tone, string> = {
  primary: "border-primary",
  foreground: "border-foreground",
  violet: "border-violet-500",
  emerald: "border-emerald-500",
  sky: "border-sky-500",
  amber: "border-amber-500",
};

export const commerce14Demo: Commerce14Props = {
  selected: "Standard",
  methods: [
    { label: "Standard", eta: "3–5 business days", price: "Free", icon: "truck" },
    { label: "Express", eta: "1–2 business days", price: "$9.99", icon: "plane" },
    { label: "Same-day", eta: "By 9pm today", price: "$19.99", icon: "bolt" },
  ],
  tone: "foreground",
};

export function Commerce14({
  methods = [],
  selected,
  tone = "foreground",
  className,
}: Commerce14Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <div className="flex w-full max-w-80 flex-col gap-1.5">
        {methods.map((m) => {
          const isSelected = m.label === selected;
          const Icon = m.icon ? ICONS[m.icon] : Truck;
          const free = m.price.toLowerCase() === "free";
          return (
            <div
              key={m.label}
              className={cn(
                "flex items-center gap-2.5 rounded-md border border-dashed p-2.5 transition-colors",
                isSelected ? selectedBorder[tone] : "border-border border-dashed bg-card"
              )}
            >
              <span
                className={cn(
                  "flex size-4 shrink-0 items-center justify-center rounded-full border-2 bg-card",
                  isSelected ? radioBorder[tone] : "border-border"
                )}
                aria-hidden="true"
              >
                {isSelected && <span className={cn("size-2 rounded-full", radioDot[tone])} />}
              </span>
              <Icon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-xs font-semibold text-card-foreground">
                  {m.label}
                </span>
                <span className="truncate text-xs text-muted-foreground">{m.eta}</span>
              </div>
              <span
                className={cn(
                  "shrink-0 font-mono text-xs tabular-nums",
                  free
                    ? "font-medium text-emerald-600 dark:text-emerald-400"
                    : "text-card-foreground"
                )}
              >
                {m.price}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

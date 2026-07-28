"use client";

import { Activity, Heart, Thermometer, Wind } from "lucide-react";
import { cn } from "@/lib/utils";

interface Vital {
  icon: "heart" | "temp" | "bp" | "spo2";
  label: string;
  value: string;
  unit: string;
}

interface Health10Props {
  heading?: string;
  subtitle?: string;
  vitals?: Vital[];
  className?: string;
}

const iconMap = {
  heart: Heart,
  temp: Thermometer,
  bp: Activity,
  spo2: Wind,
};

const iconColor: Record<Vital["icon"], string> = {
  heart: "bg-rose-500/15 text-rose-500",
  temp: "bg-orange-500/15 text-orange-500",
  bp: "bg-sky-500/15 text-sky-500",
  spo2: "bg-emerald-500/15 text-emerald-500",
};

export const health10Demo: Health10Props = {
  heading: "Morning vitals",
  subtitle: "Tue, Apr 22 · 08:14",
  vitals: [
    { icon: "heart", label: "Heart", value: "72", unit: "bpm" },
    { icon: "temp", label: "Temp", value: "36.6", unit: "°C" },
    { icon: "bp", label: "BP", value: "118/76", unit: "mmHg" },
    { icon: "spo2", label: "SpO₂", value: "98", unit: "%" },
  ],
};

export function Health10({
  heading,
  subtitle,
  vitals = [],
  className,
}: Health10Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex flex-col">
          {heading && (
            <span className="text-sm font-semibold text-card-foreground">
              {heading}
            </span>
          )}
          {subtitle && (
            <span className="text-xs text-muted-foreground">{subtitle}</span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {vitals.map((v, idx) => {
            const Icon = iconMap[v.icon];
            return (
              <div
                key={idx}
                className="flex items-center gap-2 rounded-lg bg-muted p-2"
              >
                <div
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full",
                    iconColor[v.icon]
                  )}
                >
                  <Icon className="size-3.5" aria-hidden="true" />
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-xs text-muted-foreground">
                    {v.label}
                  </span>
                  <span className="font-mono text-sm font-semibold text-card-foreground">
                    {v.value}
                    <span className="ml-0.5 text-xs font-normal text-muted-foreground">
                      {v.unit}
                    </span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

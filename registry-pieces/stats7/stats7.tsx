"use client";

import { Activity, Gauge, Users, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

type IconKey = "users" | "activity" | "gauge" | "zap";
type Tone = "primary" | "foreground" | "emerald" | "sunset" | "violet";

interface Stats7Props {
  icon?: IconKey;
  value?: string;
  label?: string;
  tone?: Tone;
  className?: string;
}

const iconMap: Record<IconKey, typeof Users> = {
  users: Users,
  activity: Activity,
  gauge: Gauge,
  zap: Zap,
};

const toneClasses: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  emerald: "bg-emerald-500 text-white",
  sunset: "bg-orange-500 text-white",
  violet: "bg-violet-500 text-white",
};

export const stats7Demo: Stats7Props = {
  icon: "zap",
  value: "2.8×",
  label: "Faster than last quarter",
  tone: "sunset",
};

export function Stats7({
  icon = "zap",
  value = "0",
  label,
  tone = "primary",
  className,
}: Stats7Props) {
  const Icon = iconMap[icon];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-64 items-center gap-3 rounded-lg border border-border bg-card px-3 py-3 shadow-sm">
        <div
          className={cn(
            "flex size-12 shrink-0 items-center justify-center rounded-lg shadow-sm",
            toneClasses[tone]
          )}
        >
          <Icon className="size-5" aria-hidden="true" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="text-2xl font-bold tabular-nums leading-none text-card-foreground">
            {value}
          </span>
          {label && (
            <span className="truncate text-xs text-muted-foreground">
              {label}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

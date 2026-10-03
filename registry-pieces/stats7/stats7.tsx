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
  bordered?: boolean;
  className?: string;
}

const iconMap: Record<IconKey, typeof Users> = {
  users: Users,
  activity: Activity,
  gauge: Gauge,
  zap: Zap,
};

const iconClasses: Record<Tone, string> = {
  primary: "text-primary",
  foreground: "text-foreground",
  emerald: "text-emerald-500",
  sunset: "text-orange-500",
  violet: "text-violet-500",
};

export const stats7Demo: Stats7Props = {
  icon: "zap",
  value: "2.8×",
  label: "Faster than last quarter",
  tone: "sunset",
  bordered: false,
};

export function Stats7({
  icon = "zap",
  value = "0",
  label,
  tone = "primary",
  bordered = false,
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
      <div className={cn("flex w-full max-w-64 items-center gap-3 rounded-lg bg-card px-3 py-3 shadow-sm", bordered && "border border-border")}>
        <Icon className={cn("size-6 shrink-0", iconClasses[tone])} aria-hidden="true" />
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

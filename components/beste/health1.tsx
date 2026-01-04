"use client";

import {
  Activity,
  Droplets,
  Heart,
  type LucideIcon,
  Moon,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HealthMetric {
  id: string;
  icon: LucideIcon;
  label: string;
  value: string;
  unit: string;
  trend?: "up" | "down" | "stable";
  trendValue?: string;
  color: "rose" | "blue" | "emerald" | "violet" | "amber";
}

interface ButtonItem {
  id: string;
  label: string;
  href?: string;
  variant?:
    | "default"
    | "secondary"
    | "outline"
    | "ghost"
    | "link"
    | "destructive";
}

interface Health1Props {
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "outline";
  };
  heading?: string;
  description?: string;
  metrics?: HealthMetric[];
  buttons?: ButtonItem[];
  cardStyle?: "colorful" | "minimal";
  columns?: 3 | 4 | "3" | "4";
  className?: string;
}

const colorMap = {
  rose: {
    bg: "bg-rose-50 dark:bg-rose-950/30",
    icon: "text-rose-500",
  },
  blue: {
    bg: "bg-blue-50 dark:bg-blue-950/30",
    icon: "text-blue-500",
  },
  emerald: {
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    icon: "text-emerald-500",
  },
  violet: {
    bg: "bg-violet-50 dark:bg-violet-950/30",
    icon: "text-violet-500",
  },
  amber: {
    bg: "bg-amber-50 dark:bg-amber-950/30",
    icon: "text-amber-500",
  },
};

export const health1Demo: Health1Props = {
  badge: { label: "Health Dashboard", variant: "outline" },
  heading: "Your daily health overview",
  description:
    "Track your vitals and wellness metrics in real-time. Stay informed, stay healthy.",
  metrics: [
    {
      id: "heart-rate",
      icon: Heart,
      label: "Heart Rate",
      value: "72",
      unit: "bpm",
      trend: "stable",
      trendValue: "Normal range",
      color: "rose",
    },
    {
      id: "blood-oxygen",
      icon: Droplets,
      label: "Blood Oxygen",
      value: "98",
      unit: "%",
      trend: "up",
      trendValue: "+2% from yesterday",
      color: "blue",
    },
    {
      id: "activity",
      icon: Activity,
      label: "Daily Activity",
      value: "8,432",
      unit: "steps",
      trend: "up",
      trendValue: "84% of goal",
      color: "emerald",
    },
    {
      id: "sleep",
      icon: Moon,
      label: "Sleep Quality",
      value: "7.5",
      unit: "hours",
      trend: "down",
      trendValue: "-30min from avg",
      color: "violet",
    },
  ],
  buttons: [
    { id: "btn-1", label: "View full report", href: "https://beste.co" },
    {
      id: "btn-2",
      label: "Set health goals",
      href: "https://beste.co",
      variant: "outline",
    },
  ],
  cardStyle: "colorful",
};

export function Health1({
  badge,
  heading,
  description,
  metrics = [],
  buttons = [],
  cardStyle = "colorful",
  columns = 4,
  className,
}: Health1Props) {
  const isMinimal = cardStyle === "minimal";
  const columnCount = Number(columns);

  if (metrics.length === 0) return null;

  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        {(badge || heading || description) && (
          <div className="mx-auto mb-14 max-w-3xl text-center">
            {badge && (
              <div className="mb-5 flex justify-center">
                <Badge variant={badge.variant ?? "default"}>
                  {badge.label}
                </Badge>
              </div>
            )}
            {heading && (
              <h2 className="text-3xl font-semibold md:text-5xl text-balance">
                {heading}
              </h2>
            )}
            {description && (
              <p className="mt-4 text-base md:text-lg text-balance text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        )}

        <div
          className={cn(
            "grid gap-4 sm:grid-cols-2",
            columnCount === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"
          )}
        >
          {metrics.map((metric) => {
            const Icon = metric.icon;
            const colors = colorMap[metric.color];

            return (
              <div
                key={metric.id}
                className="group relative overflow-hidden rounded-2xl border bg-card p-6 transition-all hover:shadow-lg"
              >
                <div className="relative">
                  {/* Header with icon */}
                  <div className="mb-4">
                    <div
                      className={cn(
                        "flex size-10 items-center justify-center rounded-xl",
                        isMinimal ? "bg-muted" : colors.bg
                      )}
                    >
                      <Icon
                        className={cn(
                          "size-5",
                          isMinimal ? "text-foreground" : colors.icon
                        )}
                      />
                    </div>
                  </div>

                  {/* Label */}
                  <p className="text-sm text-muted-foreground">
                    {metric.label}
                  </p>

                  {/* Value */}
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="text-3xl font-bold tracking-tight">
                      {metric.value}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {metric.unit}
                    </span>
                  </div>

                  {/* Trend */}
                  {metric.trend && metric.trendValue && (
                    <div className="mt-3 flex items-center gap-1.5">
                      {metric.trend === "up" && (
                        <TrendingUp className="size-4 text-emerald-500" />
                      )}
                      {metric.trend === "down" && (
                        <TrendingDown className="size-4 text-amber-500" />
                      )}
                      {metric.trend === "stable" && (
                        <div className="size-4 flex items-center justify-center">
                          <div className="h-0.5 w-3 rounded-full bg-muted-foreground" />
                        </div>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {metric.trendValue}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {buttons.length > 0 && (
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {buttons.map((button) => (
              <Button
                key={button.id}
                variant={button.variant ?? "default"}
                asChild
              >
                <Link href={button.href ?? "#"}>{button.label}</Link>
              </Button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

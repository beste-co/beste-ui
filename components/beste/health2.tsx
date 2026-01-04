"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Droplets,
  Footprints,
  Brain,
  Apple,
  type LucideIcon,
} from "lucide-react";

interface WellnessGoal {
  id: string;
  icon: LucideIcon;
  title: string;
  current: number;
  target: number;
  unit: string;
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

interface Health2Props {
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "outline";
  };
  heading?: string;
  description?: string;
  goals?: WellnessGoal[];
  buttons?: ButtonItem[];
  columns?: 3 | 4 | "3" | "4";
  className?: string;
}

export const health2Demo: Health2Props = {
  badge: { label: "Daily Goals", variant: "outline" },
  heading: "Track your wellness journey",
  description:
    "Set daily goals and watch your healthy habits grow. Small steps lead to big changes.",
  goals: [
    {
      id: "water",
      icon: Droplets,
      title: "Water Intake",
      current: 6,
      target: 8,
      unit: "glasses",
    },
    {
      id: "steps",
      icon: Footprints,
      title: "Daily Steps",
      current: 7500,
      target: 10000,
      unit: "steps",
    },
    {
      id: "mindfulness",
      icon: Brain,
      title: "Mindfulness",
      current: 15,
      target: 20,
      unit: "minutes",
    },
    {
      id: "nutrition",
      icon: Apple,
      title: "Healthy Meals",
      current: 3,
      target: 3,
      unit: "meals",
    },
  ],
  buttons: [
    { id: "btn-1", label: "Update goals", href: "https://beste.co" },
    {
      id: "btn-2",
      label: "View history",
      href: "https://beste.co",
      variant: "outline",
    },
  ],
};

export function Health2({
  badge,
  heading,
  description,
  goals = [],
  buttons = [],
  columns = 4,
  className,
}: Health2Props) {
  const columnCount = Number(columns);
  if (goals.length === 0) return null;

  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
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
          {goals.map((goal) => {
            const Icon = goal.icon;
            const percentage = Math.min((goal.current / goal.target) * 100, 100);

            return (
              <div
                key={goal.id}
                className="group rounded-2xl border bg-card p-6 transition-all hover:shadow-lg"
              >
                {/* Icon */}
                <div className="mb-4">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-muted">
                    <Icon className="size-6 text-foreground" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-semibold">{goal.title}</h3>

                {/* Progress text */}
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-2xl font-bold">
                    {goal.current.toLocaleString()}
                  </span>
                  <span className="text-muted-foreground">
                    / {goal.target.toLocaleString()} {goal.unit}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mt-4 h-2 rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-foreground transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                {/* Percentage */}
                <p className="mt-2 text-sm text-muted-foreground">
                  {Math.round(percentage)}% completed
                </p>
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

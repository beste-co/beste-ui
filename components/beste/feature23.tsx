"use client";

import { Bug, Database, Gauge, Repeat, Shield, Users } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface Area {
  id: string;
  icon?: React.ReactNode;
  title: string;
  description?: string;
  score: number;
  footnote?: string;
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

interface Feature23Props {
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "outline";
  };
  heading?: string;
  description?: string;
  areas?: Area[];
  footerNote?: string;
  buttons?: ButtonItem[];
  className?: string;
}

export const feature23Demo: Feature23Props = {
  badge: { label: "Quality", variant: "secondary" },
  heading: "Make quality visible",
  description:
    "A lightweight scoreboard that turns 'it feels better' into measurable signals your team can trust.",
  areas: [
    {
      id: "area-1",
      icon: <Gauge className="size-5" />,
      title: "Performance",
      description:
        "Track Core Web Vitals and spot regressions before they hit customers.",
      score: 92,
      footnote: "Based on last 7 days",
    },
    {
      id: "area-2",
      icon: <Shield className="size-5" />,
      title: "Security posture",
      description:
        "Surface dependency risk, misconfigurations, and access anomalies.",
      score: 88,
      footnote: "Weekly scan",
    },
    {
      id: "area-3",
      icon: <Bug className="size-5" />,
      title: "Reliability",
      description:
        "Monitor incidents, error budgets, and alert fatigue in one place.",
      score: 84,
      footnote: "SLO window",
    },
    {
      id: "area-4",
      icon: <Users className="size-5" />,
      title: "UX clarity",
      description:
        "Validate copy, hierarchy, and accessibility without slowing releases.",
      score: 90,
      footnote: "A11y checks enabled",
    },
    {
      id: "area-5",
      icon: <Database className="size-5" />,
      title: "Data accuracy",
      description:
        "Catch schema drift and broken events with automated validation.",
      score: 86,
      footnote: "Event coverage",
    },
    {
      id: "area-6",
      icon: <Repeat className="size-5" />,
      title: "Release hygiene",
      description:
        "Standardize reviews, rollbacks, and changelogs across environments.",
      score: 80,
      footnote: "Per deploy",
    },
  ],
  footerNote:
    "Tip: keep scores directional—use them to spot trends, not to blame teams.",
  buttons: [
    {
      id: "btn-1",
      label: "See dashboard sample",
      href: "https://beste.co",
      variant: "outline",
    },
  ],
};

const clampScore = (value: unknown) => {
  const parsed = typeof value === "number" ? value : Number(value);
  if (Number.isNaN(parsed)) return 0;
  return Math.max(0, Math.min(100, Math.round(parsed)));
};

export function Feature23({
  badge,
  heading,
  description,
  areas = [],
  footerNote,
  buttons = [],
  className,
}: Feature23Props) {
  if (areas.length === 0) return null;

  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        {(badge || heading || description) && (
          <div className="mx-auto mb-12 max-w-3xl text-center">
            {badge && (
              <div className="mb-5 flex justify-center">
                <Badge variant={badge.variant ?? "default"}>
                  {badge.label}
                </Badge>
              </div>
            )}
            {heading && (
              <h2 className="text-3xl font-semibold md:text-5xl">{heading}</h2>
            )}
            {description && (
              <p className="mt-4 text-base md:text-lg text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {areas.map((area) => {
            const score = clampScore(area.score);
            return (
              <div
                key={area.id}
                className="flex flex-col rounded-lg border bg-muted p-6 transition-transform duration-300 hover:-translate-y-0.5"
              >
                <div className="flex flex-1 items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    {area.icon && (
                      <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg border bg-background">
                        {area.icon}
                      </span>
                    )}
                    <div className="min-w-0">
                      <h3 className="text-base font-semibold">{area.title}</h3>
                      {area.description && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {area.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="shrink-0 text-xl font-semibold">{score}</div>
                </div>

                <div className="mt-auto pt-4 space-y-2">
                  <Progress value={score} />
                  {area.footnote && (
                    <p className="text-xs text-muted-foreground">
                      {area.footnote}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {(footerNote || buttons.length > 0) && (
          <div className="mx-auto mt-8 md:mt-12 flex max-w-3xl flex-col items-center gap-4 text-center">
            {footerNote && (
              <p className="text-sm text-muted-foreground mb-2">{footerNote}</p>
            )}
            {buttons.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2">
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
        )}
      </div>
    </section>
  );
}

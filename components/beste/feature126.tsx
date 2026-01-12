"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StatItem {
  number: string;
  label: string;
  description?: string;
}

interface ButtonItem {
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

interface Feature126Props {
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "outline";
  };
  heading?: string;
  description?: string;
  stats?: StatItem[];
  buttons?: ButtonItem[];
  className?: string;
}

export const feature126Demo: Feature126Props = {
  badge: { label: "Impact", variant: "default" },
  heading: "Numbers that speak",
  description: "Our impact by the numbers.",
  stats: [
    {
      number: "500+",
      label: "Customers",
      description: "Trusted by companies worldwide",
    },
    {
      number: "99.9%",
      label: "Uptime",
      description: "Enterprise-grade reliability",
    },
    {
      number: "50M+",
      label: "Requests/day",
      description: "Processed daily at scale",
    },
    {
      number: "<10ms",
      label: "Latency",
      description: "Lightning-fast responses",
    },
  ],
  buttons: [],
};

export function Feature126({
  badge,
  heading,
  description,
  stats = [],
  buttons = [],
  className,
}: Feature126Props) {
  if (stats.length === 0) return null;

  const count = stats.length;
  const gridCols =
    count === 1
      ? ""
      : count === 2
      ? "sm:grid-cols-2"
      : count % 3 === 0
      ? "grid-cols-1 md:grid-cols-3"
      : count % 4 === 0
      ? "sm:grid-cols-2 lg:grid-cols-4"
      : "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        {(badge || heading || description) && (
          <div className="mx-auto mb-12 max-w-3xl text-center">
            {badge && (
              <div className="mb-4 flex justify-center">
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

        <div className={cn("grid gap-4", gridCols)}>
          {stats.map((stat, index) => (
            <div
              key={index}
              className="rounded-xl border bg-card p-6 text-center"
            >
              <p className="text-4xl font-bold text-primary">{stat.number}</p>
              <p className="mt-2 font-medium">{stat.label}</p>
              {stat.description && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {stat.description}
                </p>
              )}
            </div>
          ))}
        </div>

        {buttons.length > 0 && (
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            {buttons.map((button, index) => (
              <Button key={index} variant={button.variant ?? "default"} asChild>
                <Link href={button.href ?? "#"}>{button.label}</Link>
              </Button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

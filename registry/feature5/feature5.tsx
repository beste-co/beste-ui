"use client";

import {
  BarChart3,
  Brain,
  type LucideIcon,
  RefreshCw,
  Shield,
  Users,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureItem {
  icon?: LucideIcon;
  title: string;
  description: string;
}

interface Feature5Props {
  heading?: string;
  description?: string;
  features?: FeatureItem[];
  className?: string;
}

export const feature5Demo: Feature5Props = {
  heading: "Why teams pick our platform",
  description:
    "Six capabilities you can rely on from the first day. Each row keeps the copy tight and the value plain.",
  features: [
    {
      icon: Zap,
      title: "Lightning fast performance",
      description:
        "Built on modern infrastructure for sub-second load times and seamless interactions across the product.",
    },
    {
      icon: Shield,
      title: "Enterprise security",
      description:
        "End-to-end encryption with SOC 2 alignment. Your data stays protected with the same standards banks use.",
    },
    {
      icon: RefreshCw,
      title: "Real-time sync",
      description:
        "Changes propagate instantly across every device. Teams stay aligned without manual refreshes or merge work.",
    },
    {
      icon: BarChart3,
      title: "Smart analytics",
      description:
        "Insights that surface what changed and why. Make decisions on signal, not gut feel or stale spreadsheets.",
    },
    {
      icon: Users,
      title: "Team collaboration",
      description:
        "Share, comment, and co-create without leaving the work. Permissioning stays out of the way until you need it.",
    },
    {
      icon: Brain,
      title: "AI-powered features",
      description:
        "Lean on AI for the routine — drafting, classifying, summarizing — so the team focuses on the calls that matter.",
    },
  ],
};

export function Feature5({
  heading,
  description,
  features = [],
  className,
}: Feature5Props) {
  return (
    <section className={cn("py-16 md:py-24 w-full", className)}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mb-8 max-w-2xl">
          {heading && (
            <h2 className="text-2xl font-semibold tracking-tight md:text-4xl">
              {heading}
            </h2>
          )}
          {description && (
            <p className="mt-2 text-base text-muted-foreground md:text-lg">
              {description}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <article key={index} className="flex flex-col gap-2">
                {Icon && <Icon className="size-6 text-foreground" />}
                <h3 className="text-base font-semibold md:text-lg">
                  {feature.title}
                </h3>
                <p className="max-w-md text-sm text-muted-foreground md:text-base">
                  {feature.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

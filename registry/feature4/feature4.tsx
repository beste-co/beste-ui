"use client";

import {
  BarChart3,
  type LucideIcon,
  Rocket,
  Target,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FeatureItem {
  icon?: LucideIcon;
  title: string;
  description: string;
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

interface Feature4Props {
  heading?: string;
  description?: string;
  features?: FeatureItem[];
  buttons?: ButtonItem[];
  className?: string;
}

export const feature4Demo: Feature4Props = {
  heading: "Why teams pick our digital marketing agency",
  description:
    "We combine data-driven strategies with creative excellence to help brands achieve measurable growth in the digital landscape.",
  features: [
    {
      icon: BarChart3,
      title: "Data-driven strategies",
      description:
        "Every campaign is backed by analytics and market research. Performance is tracked in real time so the budget always lands where it should.",
    },
    {
      icon: Users,
      title: "Expert team and support",
      description:
        "Certified specialists in SEO, PPC, social, and content. Each account gets a dedicated lead who understands the business goals end to end.",
    },
    {
      icon: Rocket,
      title: "Multi-channel approach",
      description:
        "From search to social, campaigns run as a single integrated plan. The brand voice stays consistent everywhere your audience shows up.",
    },
    {
      icon: Target,
      title: "Results-focused campaigns",
      description:
        "We measure quality leads and conversions, not just traffic. The performance bar is set against revenue impact from day one.",
    },
  ],
  buttons: [{ label: "Get started today", href: "https://beste.co" }],
};

export function Feature4({
  heading,
  description,
  features = [],
  buttons = [],
  className,
}: Feature4Props) {
  return (
    <section className={cn("py-16 md:py-24 w-full", className)}>
      <div className="mx-auto flex max-w-6xl flex-col items-center px-4 md:px-6">
        <div className="mb-12 flex max-w-xl flex-col items-center gap-3 text-center md:mb-20 md:gap-4">
          {heading && (
            <h2 className="text-2xl font-semibold tracking-tight md:text-4xl">
              {heading}
            </h2>
          )}
          {description && (
            <p className="text-base md:text-lg text-muted-foreground">
              {description}
            </p>
          )}
        </div>

        {features.length > 0 && (
          <div className="grid gap-10 md:grid-cols-2 md:gap-x-32 md:gap-y-20">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <article key={index} className="flex flex-col">
                  {Icon && (
                    <Icon className="mb-6 size-8 text-muted-foreground" />
                  )}
                  <h3 className="mb-2 text-base font-semibold md:text-lg">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground md:text-base">
                    {feature.description}
                  </p>
                </article>
              );
            })}
          </div>
        )}

        {buttons.length > 0 && (
          <div className="mt-8 flex flex-wrap justify-center gap-3 md:mt-16">
            {buttons.map((button, index) => (
              <Button
                key={index}
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

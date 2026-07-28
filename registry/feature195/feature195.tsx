"use client";

import { ClipboardCheck, FileText, Gem, type LucideIcon, PointerIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface FeatureItem {
  icon: LucideIcon;
  title: string;
}

interface Feature195Props {
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "outline";
  };
  heading?: string;
  description?: string;
  features?: FeatureItem[];
  className?: string;
}

export const feature195Demo: Feature195Props = {
  heading: "Let us Guide you Through Your Digital Transformation",
  features: [
    {
      icon: FileText,
      title: "Understanding Your Unique Requirements",
    },
    {
      icon: Gem,
      title: "Digital Strategy Powered By Nebim's Expertise",
    },
    {
      icon: ClipboardCheck,
      title: "Fast Implementation",
    },
    {
      icon: PointerIcon,
      title: "Effortless Operations",
    },
  ],
};

export function Feature195({
  badge,
  heading,
  description,
  features = [],
  className,
}: Feature195Props) {
  return (
    <section className={cn("py-16 md:py-24 w-full", className)}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        {(badge || heading || description) && (
          <div className="mx-auto mb-12 max-w-3xl text-center md:mb-16">
            {badge && (
              <div className="mb-4 flex justify-center">
                <Badge variant={badge.variant ?? "default"}>{badge.label}</Badge>
              </div>
            )}
            {heading && (
              <h2 className="text-3xl font-bold tracking-tight text-balance md:text-5xl">
                {heading}
              </h2>
            )}
            {description && (
              <p className="mt-4 text-base text-balance text-muted-foreground md:text-lg">
                {description}
              </p>
            )}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center gap-10 rounded-md border bg-card p-8 text-center md:p-10"
              >
                <div className="flex size-20 items-center justify-center rounded-full bg-muted">
                  <Icon className="size-9 text-foreground" strokeWidth={1.75} />
                </div>
                <h3 className="text-lg font-semibold text-balance md:text-xl">{feature.title}</h3>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

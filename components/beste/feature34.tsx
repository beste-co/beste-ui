"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NumberedFeature {
  id: string;
  title: string;
  description: string;
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

interface Feature34Props {
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "outline";
  };
  heading?: string;
  description?: string;
  features?: NumberedFeature[];
  buttons?: ButtonItem[];
  columns?: 1 | 2;
  className?: string;
}

export const feature34Demo: Feature34Props = {
  badge: { label: "Why us", variant: "default" },
  heading: "Six reasons teams choose us",
  description:
    "We've spent years refining the details. Here's what sets us apart.",
  features: [
    {
      id: "feature-1",
      title: "No learning curve",
      description:
        "Familiar interface patterns mean your team can start working immediately. No training sessions required.",
    },
    {
      id: "feature-2",
      title: "Blazing fast performance",
      description:
        "Built on modern infrastructure with global edge caching. Every action feels instant.",
    },
    {
      id: "feature-3",
      title: "Enterprise-ready security",
      description:
        "SOC 2 Type II certified, GDPR compliant, with SSO and advanced audit logs included.",
    },
    {
      id: "feature-4",
      title: "Transparent pricing",
      description:
        "One plan, one price. No hidden fees, no surprise overages, no complicated tiers.",
    },
    {
      id: "feature-5",
      title: "Human support",
      description:
        "Real people who understand the product. Average response time under 2 hours.",
    },
    {
      id: "feature-6",
      title: "Open ecosystem",
      description:
        "Full API access, webhooks, and 100+ integrations. Build exactly what you need.",
    },
  ],
  columns: 2,
  buttons: [
    { id: "btn-1", label: "Start free trial", href: "https://beste.co" },
    {
      id: "btn-2",
      label: "Talk to sales",
      href: "https://beste.co",
      variant: "outline",
    },
  ],
};

export function Feature34({
  badge,
  heading,
  description,
  features = [],
  buttons = [],
  columns = 2,
  className,
}: Feature34Props) {
  if (features.length === 0) return null;

  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        {(badge || heading || description) && (
          <div className="mx-auto mb-12 sm:mb-16 max-w-3xl text-center">
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
            "grid gap-x-8 gap-y-6",
            Number(columns) === 2 ? "md:grid-cols-2" : "max-w-3xl mx-auto"
          )}
        >
          {features.map((feature, index) => (
            <div key={feature.id} className="flex gap-3 sm:gap-5">
              {/* Number */}
              <div className="flex size-9 sm:size-12 shrink-0 items-center justify-center rounded-full border-2 border-primary text-sm sm:text-lg font-bold text-primary">
                {String(index + 1).padStart(2, "0")}
              </div>

              {/* Content */}
              <div className="pt-1">
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {buttons.length > 0 && (
          <div className="mt-10 sm:mt-14 flex flex-wrap justify-center gap-3">
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

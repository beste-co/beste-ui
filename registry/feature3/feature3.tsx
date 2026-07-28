"use client";

import {
  BarChart3,
  Check,
  Globe,
  HelpCircle,
  type LucideIcon,
  Shield,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
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

interface Feature3Props {
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "outline";
  };
  heading?: string;
  description?: string;
  features?: FeatureItem[];
  button?: ButtonItem;
  bottomText?: string;
  className?: string;
}

export const feature3Demo: Feature3Props = {
  badge: { label: "Services", variant: "default" },
  heading: "All-in-one web solutions",
  description:
    "Our web agency offers a complete suite of tools and services to build, grow, and optimize your online presence.",
  features: [
    {
      icon: Zap,
      title: "Blazing fast websites",
      description:
        "High-performance sites optimized for speed and user experience.",
    },
    {
      icon: BarChart3,
      title: "SEO and analytics",
      description:
        "Boost rankings and track performance with advanced SEO and analytics tools.",
    },
    {
      icon: Shield,
      title: "Robust security",
      description:
        "Industry-standard encryption and protection for every customer touchpoint.",
    },
    {
      icon: Globe,
      title: "Global scalability",
      description:
        "Reach audiences worldwide with scalable, cloud-based infrastructure.",
    },
    {
      icon: Check,
      title: "Seamless integrations",
      description:
        "Connect to the tools and platforms your team already runs on.",
    },
    {
      icon: HelpCircle,
      title: "Dedicated support",
      description:
        "Round-the-clock expert support so your site stays online and on-brand.",
    },
  ],
  button: { label: "Launch your site", href: "https://beste.co" },
  bottomText: "No upfront costs. Start your free consultation today.",
};

export function Feature3({
  badge,
  heading,
  description,
  features = [],
  button,
  bottomText,
  className,
}: Feature3Props) {
  return (
    <section className={cn("py-16 md:py-24 w-full", className)}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          {badge && (
            <div className="flex justify-center">
              <Badge variant={badge.variant ?? "default"}>{badge.label}</Badge>
            </div>
          )}
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

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <article
                key={index}
                className="flex flex-col items-start gap-2 rounded-md border bg-muted/30 p-6"
              >
                {Icon && <Icon className="size-6 text-foreground" />}
                <h3 className="text-base font-semibold md:text-lg">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground md:text-base">
                  {feature.description}
                </p>
              </article>
            );
          })}
        </div>

        {(button || bottomText) && (
          <div className="mt-12 flex flex-col items-center justify-center gap-4">
            {button && (
              <Button variant={button.variant ?? "default"} asChild>
                <Link href={button.href ?? "#"}>{button.label}</Link>
              </Button>
            )}
            {bottomText && (
              <p className="text-sm text-muted-foreground">{bottomText}</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

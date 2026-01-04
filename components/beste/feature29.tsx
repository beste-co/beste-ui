"use client";

import {
  BarChart3,
  Clock,
  Globe,
  Lock,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FeatureCard {
  id: string;
  icon?: React.ReactNode;
  title: string;
  description: string;
  stat?: {
    value: string;
    label: string;
  };
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

interface Feature29Props {
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "outline";
  };
  heading?: string;
  description?: string;
  features?: FeatureCard[];
  buttons?: ButtonItem[];
  className?: string;
}

export const feature29Demo: Feature29Props = {
  badge: { label: "Platform", variant: "secondary" },
  heading: "Everything you need to scale",
  description:
    "A complete toolkit designed to grow with your business, from startup to enterprise.",
  features: [
    {
      id: "feature-1",
      icon: <Sparkles className="size-6" />,
      title: "AI-Powered Insights",
      description:
        "Get actionable recommendations based on your data patterns and industry benchmarks.",
      stat: {
        value: "3x",
        label: "faster decisions",
      },
    },
    {
      id: "feature-2",
      icon: <Globe className="size-6" />,
      title: "Global CDN",
      description:
        "Content delivered from 200+ edge locations for blazing-fast load times worldwide.",
      stat: {
        value: "<50ms",
        label: "avg. latency",
      },
    },
    {
      id: "feature-3",
      icon: <Lock className="size-6" />,
      title: "Enterprise Security",
      description:
        "SOC 2 Type II certified with end-to-end encryption and granular access controls.",
      stat: {
        value: "99.99%",
        label: "uptime SLA",
      },
    },
    {
      id: "feature-4",
      icon: <MessageSquare className="size-6" />,
      title: "Real-time Collaboration",
      description:
        "Work together seamlessly with live cursors, comments, and instant sync.",
      stat: {
        value: "10K+",
        label: "active teams",
      },
    },
    {
      id: "feature-5",
      icon: <BarChart3 className="size-6" />,
      title: "Advanced Analytics",
      description:
        "Deep insights into user behavior, conversions, and content performance.",
      stat: {
        value: "50+",
        label: "metrics tracked",
      },
    },
    {
      id: "feature-6",
      icon: <Clock className="size-6" />,
      title: "Version History",
      description:
        "Never lose work with automatic versioning and one-click rollback.",
      stat: {
        value: "90 days",
        label: "retention",
      },
    },
  ],
  buttons: [
    { id: "btn-1", label: "Explore all features", href: "https://beste.co" },
  ],
};

export function Feature29({
  badge,
  heading,
  description,
  features = [],
  buttons = [],
  className,
}: Feature29Props) {
  if (features.length === 0) return null;

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

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="group/feature29 relative flex flex-col rounded-xl border bg-card p-5 sm:p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-lg"
            >
              {/* Icon */}
              <div className="mb-4 inline-flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover/feature29:bg-primary group-hover/feature29:text-primary-foreground">
                {feature.icon}
              </div>

              {/* Title & Description */}
              <div className="flex-1">
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>

              {/* Stat */}
              {feature.stat && (
                <div className="mt-4 flex items-baseline justify-between border-t pt-4">
                  <span className="text-sm text-muted-foreground">
                    {feature.stat.label}
                  </span>
                  <span className="text-2xl font-bold text-primary">
                    {feature.stat.value}
                  </span>
                </div>
              )}
            </div>
          ))}
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

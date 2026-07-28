"use client";

import { BarChart3, Globe, type LucideIcon, RefreshCw, Shield, Sparkles, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatItem {
  value: string;
  label: string;
}

interface FeatureItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface Feature179Props {
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "outline";
  };
  heading?: string;
  description?: string;
  stats?: StatItem[];
  features?: FeatureItem[];
  className?: string;
}

export const feature179Demo: Feature179Props = {
  badge: { label: "Platform", variant: "default" },
  heading: "One Platform to <strong>Replace Them All</strong>",
  description:
    "Consolidate your entire workflow into a single, powerful platform. Less context switching, more shipping.",
  stats: [
    { value: "99.99%", label: "Uptime SLA" },
    { value: "50ms", label: "Avg Response" },
    { value: "10M+", label: "API Requests/Day" },
    { value: "4.9/5", label: "Customer Rating" },
  ],
  features: [
    {
      icon: Zap,
      title: "Instant Performance Boost",
      description:
        "See measurable improvements from day one. Our optimized infrastructure delivers sub-100ms response times across every touchpoint.",
    },
    {
      icon: Shield,
      title: "Enterprise-Grade Security",
      description:
        "SOC 2 Type II certified with end-to-end encryption. Your data stays protected with automatic backups and role-based access controls.",
    },
    {
      icon: BarChart3,
      title: "Actionable Analytics",
      description:
        "Go beyond vanity metrics. Track real business impact with custom dashboards, cohort analysis, and automated reporting delivered weekly.",
    },
    {
      icon: RefreshCw,
      title: "Seamless Integrations",
      description:
        "Connect with 200+ tools your team already uses. Two-click setup with Slack, HubSpot, Salesforce, and every major platform.",
    },
    {
      icon: Globe,
      title: "Global Edge Network",
      description:
        "Serve users in 190+ countries with localized content delivery. Auto-scaling infrastructure handles traffic spikes without breaking a sweat.",
    },
    {
      icon: Sparkles,
      title: "AI-Powered Automation",
      description:
        "Let intelligent workflows handle the repetitive work. From lead scoring to content optimization, AI keeps your pipeline moving 24/7.",
    },
  ],
};

export function Feature179({
  badge,
  heading,
  description,
  stats = [],
  features = [],
  className,
}: Feature179Props) {
  return (
    <section className={cn("py-16 md:py-24 w-full", className)}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="flex flex-col gap-12 md:flex-row md:gap-0">
          {/* Left Column - Sticky */}
          <div className="md:w-[45%] md:pr-12">
            <div className="md:sticky md:top-[100px]">
              {badge && (
                <div className="mb-6">
                  <Badge variant={badge.variant ?? "default"}>{badge.label}</Badge>
                </div>
              )}
              {heading && (
                <h2
                  className="text-2xl font-bold leading-tight md:text-4xl [&>strong]:text-primary [&>strong]:font-bold"
                  dangerouslySetInnerHTML={{ __html: heading }}
                />
              )}
              {description && (
                <p className="mt-6 max-w-md text-base text-muted-foreground md:text-lg">
                  {description}
                </p>
              )}
              {stats.length > 0 && (
                <div className="mt-10 grid grid-cols-2 gap-6">
                  {stats.map((stat, index) => (
                    <div key={index}>
                      <div className="text-2xl font-bold md:text-3xl">{stat.value}</div>
                      <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="hidden w-px bg-border md:block" />

          {/* Right Column - Cards */}
          <div className="md:w-[55%] md:pl-12">
            <div className="space-y-4 md:space-y-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="group/feature179 rounded-md border bg-card p-6">
                    <div className="flex gap-4">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted">
                        <Icon className="size-5 text-foreground" />
                      </div>
                      <div className="pt-0.5">
                        <h3 className="text-base font-semibold md:text-lg">{feature.title}</h3>
                        <p className="mt-2 text-sm text-muted-foreground md:text-base">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

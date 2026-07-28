"use client";

import { BarChart3, Globe, type LucideIcon, RefreshCw, Shield, Sparkles, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface FeatureItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface Feature180Props {
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "outline";
  };
  heading?: string;
  description?: string;
  image?: {
    src: string;
    alt: string;
  };
  features?: FeatureItem[];
  className?: string;
}

export const feature180Demo: Feature180Props = {
  badge: { label: "How It Works", variant: "default" },
  heading: "From Idea to Launch in <strong>Record Time</strong>",
  description:
    "Our end-to-end platform handles the heavy lifting so your team can focus on building what matters most.",
  image: {
    src: "https://images.unsplash.com/photo-1697133081695-90070de25bc3?w=800&h=900&fit=crop",
    alt: "Platform dashboard",
  },
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

export function Feature180({
  badge,
  heading,
  description,
  image,
  features = [],
  className,
}: Feature180Props) {
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
              {image && (
                <div className="relative mt-10 aspect-[4/3] overflow-hidden rounded-md">
                  <img
                    className="absolute inset-0 size-full object-cover"
                    src={image.src}
                    alt={image.alt}
                  />
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
                  <div key={index} className="group/feature180 rounded-md border bg-card p-6">
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

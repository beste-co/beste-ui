"use client";

import { BarChart3, Cloud, Globe, Lock, Sparkles, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface FeatureItem {
  icon?: React.ReactNode;
  title: string;
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

interface Feature107Props {
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "outline";
  };
  heading?: string;
  description?: string;
  items?: FeatureItem[];
  buttons?: ButtonItem[];
  className?: string;
}

export const feature107Demo: Feature107Props = {
  badge: { label: "Platform", variant: "default" },
  heading: "Everything you need",
  description: "A complete toolkit for modern teams.",
  items: [
    {
      icon: <Cloud className="size-8" />,
      title: "Cloud Native",
      description: "Built for the cloud with automatic scaling.",
    },
    {
      icon: <Lock className="size-8" />,
      title: "Enterprise Security",
      description: "Bank-level encryption and compliance.",
    },
    {
      icon: <Users className="size-8" />,
      title: "Team Collaboration",
      description: "Real-time editing and shared workspaces.",
    },
    {
      icon: <BarChart3 className="size-8" />,
      title: "Advanced Analytics",
      description: "Insights that drive better decisions.",
    },
    {
      icon: <Globe className="size-8" />,
      title: "Global CDN",
      description: "Fast delivery anywhere in the world.",
    },
    {
      icon: <Sparkles className="size-8" />,
      title: "AI Powered",
      description: "Smart automation and recommendations.",
    },
  ],
  buttons: [{ label: "Explore Features", href: "https://beste.co" }],
};

export function Feature107({
  badge,
  heading,
  description,
  items = [],
  buttons = [],
  className,
}: Feature107Props) {
  return (
    <section className={cn("py-16 md:py-24 w-full", className)}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        {(badge || heading || description) && (
          <div className="mx-auto mb-8 md:mb-12 max-w-3xl text-center">
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

        <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center rounded-xl border bg-card p-8 text-center"
            >
              {item.icon && (
                <div className="mb-4 text-primary">{item.icon}</div>
              )}
              <h3 className="text-lg font-semibold">{item.title}</h3>
              {item.description && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {item.description}
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

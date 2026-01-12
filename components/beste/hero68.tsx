"use client";

import { ArrowRight, Layers, Lock, Zap } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FeatureCard {
  icon: "layers" | "lock" | "zap";
  title: string;
  description: string;
}

interface ButtonItem {
  label: string;
  href?: string;
  variant?: "default" | "secondary" | "outline" | "ghost";
}

interface Hero68Props {
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "outline";
  };
  heading?: string;
  description?: string;
  buttons?: ButtonItem[];
  features?: FeatureCard[];
  className?: string;
}

const iconMap = {
  layers: Layers,
  lock: Lock,
  zap: Zap,
};

export const hero68Demo: Hero68Props = {
  badge: { label: "Platform", variant: "outline" },
  heading: "Everything you need to scale",
  description:
    "A complete platform with all the tools you need to build, deploy, and grow your applications.",
  buttons: [{ label: "Start Building", href: "https://beste.co" }],
  features: [
    {
      icon: "zap",
      title: "Lightning Fast",
      description: "Deploy in seconds with our optimized infrastructure",
    },
    {
      icon: "lock",
      title: "Secure by Default",
      description: "Enterprise-grade security with zero configuration",
    },
    {
      icon: "layers",
      title: "Infinitely Scalable",
      description: "Automatically scale from zero to millions of users",
    },
  ],
};

export function Hero68({
  badge,
  heading,
  description,
  buttons = [],
  features = [],
  className,
}: Hero68Props) {
  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="flex flex-col items-center text-center">
          {badge && (
            <Badge variant={badge.variant ?? "default"} className="mb-6">
              {badge.label}
            </Badge>
          )}

          {heading && (
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              {heading}
            </h1>
          )}

          {description && (
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
              {description}
            </p>
          )}

          {buttons.length > 0 && (
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              {buttons.map((button, index) => (
                <Button
                  key={index}
                  size="lg"
                  variant={button.variant ?? "default"}
                  asChild
                >
                  <Link href={button.href ?? "#"}>
                    {button.label}
                    {index === 0 && <ArrowRight className="size-4" />}
                  </Link>
                </Button>
              ))}
            </div>
          )}
        </div>

        {features.length > 0 && (
          <div className="mt-16 grid gap-8 md:grid-cols-3 max-w-3xl mx-auto">
            {features.map((feature, index) => {
              const Icon = iconMap[feature.icon];
              return (
                <div
                  key={index}
                  className="flex flex-col items-center text-center"
                >
                  <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/10">
                    <Icon className="size-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

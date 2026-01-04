"use client";

import { Activity, Check, Heart, Leaf, Shield, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Feature {
  id: string;
  icon?: React.ReactNode;
  title: string;
  description: string;
}

interface Feature26Props {
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "outline";
  };
  heading?: string;
  description?: string;
  features?: Feature[];
  className?: string;
}

export const feature26Demo: Feature26Props = {
  badge: { label: "Features", variant: "default" },
  heading: "Why Wellory?",
  description:
    "We simplify complex health data. A lifestyle plan that is actionable, sustainable, and unique to you.",
  features: [
    {
      id: "feature-1",
      icon: <Leaf className="size-6" />,
      title: "Holistic Nutrition",
      description:
        "Beyond counting calories. Smart meal plans that optimize your hormone balance and energy levels.",
    },
    {
      id: "feature-2",
      icon: <Activity className="size-6" />,
      title: "Smart Activity",
      description:
        "Adaptive workouts that push limits when you're energetic and respect your rest when you're tired.",
    },
    {
      id: "feature-3",
      icon: <Shield className="size-6" />,
      title: "Data Privacy",
      description:
        "Your health data is personal. End-to-end encryption ensures your data stays in your control.",
    },
    {
      id: "feature-4",
      icon: <Heart className="size-6" />,
      title: "Cardio Analysis",
      description:
        "Measure and manage stress levels with Heart Rate Variability (HRV) analysis.",
    },
    {
      id: "feature-5",
      icon: <Star className="size-6" />,
      title: "Sleep Coaching",
      description:
        "Sleep windows aligned with your circadian rhythm to increase deep sleep duration.",
    },
    {
      id: "feature-6",
      icon: <Check className="size-6" />,
      title: "Habit Tracking",
      description:
        "Small steps, big changes. Build new habits without breaking the chain.",
    },
  ],
};

export function Feature26({
  badge,
  heading,
  description,
  features = [],
  className,
}: Feature26Props) {
  return (
    <section className={cn("py-16 md:py-24 overflow-hidden", className)}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          {badge && (
            <div className="mb-4">
              <Badge variant={badge.variant ?? "default"}>{badge.label}</Badge>
            </div>
          )}
          {heading && (
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              {heading}
            </h2>
          )}
          {description && (
            <p className="text-lg text-balance text-muted-foreground">
              {description}
            </p>
          )}
        </div>

        {/* Features Grid */}
        {features.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="rounded-lg border shadow-sm p-8 bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group/feature26"
              >
                {/* Icon */}
                <div className="w-14 h-14 rounded-lg flex items-center justify-center mb-6 bg-primary/10 text-primary group-hover/feature26:bg-primary group-hover/feature26:text-background transition-colors">
                  {feature.icon || <Check className="size-6" />}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>

                {/* Description */}
                <p className="leading-relaxed text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

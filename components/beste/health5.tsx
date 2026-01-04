"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Clock, ArrowRight, type LucideIcon } from "lucide-react";

interface ServiceFeature {
  id: string;
  text: string;
}

interface ServiceButton {
  label: string;
  href: string;
  variant?:
    | "default"
    | "secondary"
    | "outline"
    | "ghost"
    | "link"
    | "destructive";
}

interface HealthService {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  duration?: string;
  features?: ServiceFeature[];
  button?: ServiceButton;
}

interface Health5Props {
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "outline";
  };
  heading?: string;
  description?: string;
  services?: HealthService[];
  columns?: 2 | 3 | "2" | "3";
  className?: string;
}

import { Heart, Brain, Stethoscope } from "lucide-react";

export const health5Demo: Health5Props = {
  badge: { label: "Our Services", variant: "outline" },
  heading: "Comprehensive healthcare for you",
  description:
    "We offer a wide range of medical services designed to keep you and your family healthy at every stage of life.",
  services: [
    {
      id: "cardiology",
      icon: Heart,
      title: "Cardiology",
      description:
        "Complete heart health assessment and treatment plans tailored to your cardiovascular needs.",
      duration: "45-60 min",
      features: [
        { id: "f1", text: "ECG & stress testing" },
        { id: "f2", text: "Blood pressure monitoring" },
        { id: "f3", text: "Cholesterol management" },
      ],
      button: {
        label: "Learn more",
        href: "https://beste.co",
        variant: "default",
      },
    },
    {
      id: "neurology",
      icon: Brain,
      title: "Neurology",
      description:
        "Expert diagnosis and care for conditions affecting the brain, spine, and nervous system.",
      duration: "30-45 min",
      features: [
        { id: "f4", text: "Headache & migraine treatment" },
        { id: "f5", text: "Memory assessment" },
        { id: "f6", text: "Nerve conduction studies" },
      ],
      button: {
        label: "Learn more",
        href: "https://beste.co",
        variant: "default",
      },
    },
    {
      id: "general",
      icon: Stethoscope,
      title: "General Medicine",
      description:
        "Primary care services for preventive health, routine check-ups, and treatment of common conditions.",
      duration: "20-30 min",
      features: [
        { id: "f7", text: "Annual health check-ups" },
        { id: "f8", text: "Vaccination programs" },
        { id: "f9", text: "Chronic disease management" },
      ],
      button: {
        label: "Learn more",
        href: "https://beste.co",
        variant: "default",
      },
    },
  ],
  columns: 3,
};

export function Health5({
  badge,
  heading,
  description,
  services = [],
  columns = 3,
  className,
}: Health5Props) {
  const columnCount = Number(columns);
  if (services.length === 0) return null;

  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        {(badge || heading || description) && (
          <div className="mx-auto mb-8 md:mb-12 max-w-3xl text-center">
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
            "grid gap-6",
            columnCount === 2 ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3"
          )}
        >
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <div
                key={service.id}
                className="group flex flex-col rounded-2xl border bg-card p-4 md:p-6 transition-all hover:shadow-lg"
              >
                {/* Icon */}
                <div className="mb-4">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-muted">
                    <Icon className="size-6 text-foreground" />
                  </div>
                </div>

                {/* Title & Duration */}
                <div className="mb-3 flex flex-col md:flex-row items-start justify-between gap-2">
                  <h3 className="text-xl font-semibold">{service.title}</h3>
                  {service.duration && (
                    <div className="flex shrink-0 items-center gap-1.5 text-sm text-muted-foreground">
                      <Clock className="size-4" />
                      <span>{service.duration}</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="mb-4 text-muted-foreground">
                  {service.description}
                </p>

                {/* Features */}
                {service.features && service.features.length > 0 && (
                  <ul className="mb-6 space-y-2">
                    {service.features.map((feature) => (
                      <li
                        key={feature.id}
                        className="flex items-center gap-2 text-sm"
                      >
                        <span className="size-1.5 shrink-0 rounded-full bg-foreground" />
                        <span>{feature.text}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Button */}
                {service.button && (
                  <div className="mt-auto">
                    <Button variant={service.button.variant ?? "ghost"} asChild>
                      <Link href={service.button.href}>
                        {service.button.label}
                        <ArrowRight className="size-4" />
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

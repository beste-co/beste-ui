"use client";

import { Check, Circle, Clock, Rocket, Settings, Zap } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TimelineStep {
  id: string;
  icon?: React.ReactNode;
  title: string;
  description?: string;
  duration?: string;
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

interface Feature28Props {
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "outline";
  };
  heading?: string;
  description?: string;
  steps?: TimelineStep[];
  buttons?: ButtonItem[];
  className?: string;
}

export const feature28Demo: Feature28Props = {
  badge: { label: "How it works", variant: "default" },
  heading: "From signup to success in 4 steps",
  description:
    "A streamlined onboarding process that gets you up and running fast, without sacrificing depth or flexibility.",
  steps: [
    {
      id: "step-1",
      icon: <Rocket className="size-5" />,
      title: "Create your account",
      description:
        "Sign up with email or SSO. No credit card required to get started.",
      duration: "2 min",
    },
    {
      id: "step-2",
      icon: <Settings className="size-5" />,
      title: "Connect your tools",
      description:
        "Integrate with your existing stack. We support 50+ popular services out of the box.",
      duration: "5 min",
    },
    {
      id: "step-3",
      icon: <Zap className="size-5" />,
      title: "Configure workflows",
      description:
        "Set up automations using our visual builder. No code required.",
      duration: "10 min",
    },
    {
      id: "step-4",
      icon: <Check className="size-5" />,
      title: "Go live",
      description:
        "Deploy to production with one click. Monitor results in real-time.",
      duration: "1 min",
    },
  ],
  buttons: [
    { id: "btn-1", label: "Get started free", href: "https://beste.co" },
    {
      id: "btn-2",
      label: "Watch walkthrough",
      href: "https://beste.co",
      variant: "outline",
    },
  ],
};

export function Feature28({
  badge,
  heading,
  description,
  steps = [],
  buttons = [],
  className,
}: Feature28Props) {
  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        {(badge || heading || description) && (
          <div className="mx-auto mb-12 md:mb-16 max-w-3xl text-center">
            {badge && (
              <div className="mb-5 flex justify-center">
                <Badge variant={badge.variant ?? "default"}>
                  {badge.label}
                </Badge>
              </div>
            )}
            {heading && (
              <h2 className="text-3xl font-semibold text-balance md:text-5xl">
                {heading}
              </h2>
            )}
            {description && (
              <p className="mt-6 text-balance text-base md:text-lg text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Timeline - Desktop */}
        <div className="hidden md:block">
          <div className="relative">
            {/* Horizontal line */}
            <div className="absolute left-0 right-0 top-6 h-0.5 bg-border" />

            <div
              className={cn("grid gap-4", {
                "grid-cols-2": steps.length === 2,
                "grid-cols-3": steps.length === 3,
                "grid-cols-4": steps.length === 4,
                "grid-cols-5": steps.length >= 5,
              })}
            >
              {steps.map((step, index) => (
                <div key={step.id} className="relative">
                  {/* Step number circle */}
                  <div className="relative z-10 mx-auto flex size-12 items-center justify-center rounded-full border-2 border-border bg-background">
                    {step.icon || (
                      <span className="text-sm font-semibold">{index + 1}</span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="mt-6 text-center">
                    <h3 className="text-lg text-balance font-semibold">
                      {step.title}
                    </h3>
                    {step.description && (
                      <p className="mt-2 text-sm text-balance text-muted-foreground">
                        {step.description}
                      </p>
                    )}
                    {step.duration && (
                      <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                        <Clock className="size-3" />
                        {step.duration}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline - Mobile */}
        <div className="md:hidden">
          <div className="relative space-y-3 pl-8">
            {/* Vertical line */}
            <div className="absolute bottom-0 left-3 top-0 w-[1px] bg-border" />

            {steps.map((step, index) => (
              <div key={step.id} className="relative">
                {/* Step circle */}
                <div className="absolute -left-8 flex size-6 items-center justify-center rounded-full border-1 sm:border-2 border-border bg-background">
                  {step.icon ? (
                    <div className="scale-60">{step.icon}</div>
                  ) : (
                    <Circle className="size-2 fill-primary text-primary" />
                  )}
                </div>

                {/* Content */}
                <div className="rounded-lg border bg-muted p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-xs font-medium text-muted-foreground">
                        Step {index + 1}
                      </span>
                      <h3 className="mt-1 font-semibold">{step.title}</h3>
                    </div>
                    {step.duration && (
                      <div className="inline-flex shrink-0 items-center gap-1 rounded-full bg-background px-2 py-0.5 text-xs text-muted-foreground">
                        <Clock className="size-3" />
                        {step.duration}
                      </div>
                    )}
                  </div>
                  {step.description && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {buttons.length > 0 && (
          <div className="mt-8 md:mt-12 flex flex-wrap justify-center gap-3">
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

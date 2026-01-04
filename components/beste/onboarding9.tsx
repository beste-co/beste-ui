"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, Check, type LucideIcon } from "lucide-react";
import { useState } from "react";

interface Step {
  id: string;
  title: string;
  description?: string;
  icon?: LucideIcon;
}

interface Onboarding9Props {
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "outline";
  };
  heading?: string;
  steps?: Step[];
  currentStep?: number;
  labels?: {
    next?: string;
    back?: string;
    finish?: string;
  };
  className?: string;
}

export const onboarding9Demo: Onboarding9Props = {
  badge: {
    label: "Quick Setup",
    variant: "secondary",
  },
  heading: "Get started in minutes",
  steps: [
    {
      id: "1",
      title: "Welcome aboard!",
      description:
        "We're excited to have you here. Let's get your account set up in just a few simple steps.",
    },
    {
      id: "2",
      title: "Connect your tools",
      description:
        "Link your favorite apps and services to streamline your workflow and boost productivity.",
    },
    {
      id: "3",
      title: "Customize your space",
      description:
        "Personalize your dashboard and settings to match your preferences and work style.",
    },
    {
      id: "4",
      title: "You're all set!",
      description:
        "Congratulations! Your account is ready. Start exploring and make the most of your new workspace.",
    },
  ],
  currentStep: 0,
  labels: {
    next: "Continue",
    back: "Back",
    finish: "Get Started",
  },
};

export function Onboarding9({
  badge,
  heading,
  steps = [],
  currentStep: initialStep = 0,
  labels = {},
  className,
}: Onboarding9Props) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const { next: nextLabel, back: backLabel, finish: finishLabel } = labels;

  if (steps.length === 0) return null;

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = () => {
    if (!isLastStep) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (!isFirstStep) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleFinish = () => {
    console.log("Onboarding completed!");
  };

  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="mx-auto max-w-2xl px-4 md:px-6">
        {/* Header */}
        <div className="mb-8 text-center">
          {badge && (
            <Badge variant={badge.variant ?? "default"} className="mb-4">
              {badge.label}
            </Badge>
          )}
          {heading && (
            <h2 className="text-2xl font-semibold md:text-4xl">{heading}</h2>
          )}
        </div>

        {/* Step indicators */}
        <div className="mb-8 flex items-center justify-center gap-2">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;

            return (
              <div
                key={step.id}
                className={cn(
                  "flex size-10 items-center justify-center rounded-lg border-2 text-sm font-medium transition-all",
                  isCompleted &&
                    "border-primary bg-primary text-primary-foreground",
                  isCurrent &&
                    "scale-110 border-primary bg-background text-primary",
                  !isCompleted &&
                    !isCurrent &&
                    "border-muted-foreground/30 bg-background text-muted-foreground"
                )}
              >
                {isCompleted ? <Check className="size-5" /> : index + 1}
              </div>
            );
          })}
        </div>

        {/* Content */}
        <div className="relative min-h-[200px] overflow-hidden rounded-lg border bg-card p-6 md:p-10">
          <div className="text-center">
            <h3 className="mb-4 text-xl font-semibold md:text-2xl">
              {currentStepData?.title}
            </h3>
            <p className="mx-auto max-w-md text-muted-foreground">
              {currentStepData?.description}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-center gap-3">
          {!isFirstStep && (
            <Button variant="outline" size="lg" onClick={handleBack}>
              <ArrowLeft className="size-4" />
              {backLabel}
            </Button>
          )}
          <Button size="lg" onClick={isLastStep ? handleFinish : handleNext}>
            {isLastStep ? (
              <>
                {finishLabel}
                <Check className="size-4" />
              </>
            ) : (
              <>
                {nextLabel}
                <ArrowRight className="size-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </section>
  );
}

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ButtonConfig {
  label: string;
  href: string;
  variant?: "default" | "ghost" | "outline";
}

interface Onboarding1Props {
  badge?: string;
  heading?: string;
  description?: string;
  image?: {
    src: string;
    alt: string;
  };
  currentStep?: number;
  totalSteps?: number;
  buttons?: ButtonConfig[];
  labels?: {
    stepOf?: string;
  };
  className?: string;
}

export const onboarding1Demo: Onboarding1Props = {
  badge: "Welcome",
  heading: "Let's get you started",
  description:
    "We're excited to have you here. Follow a few simple steps to set up your account and unlock the full potential of our platform.",
  image: {
    src: "https://images.unsplash.com/photo-1616449973117-0e1d99c56ed3?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Team collaboration",
  },
  currentStep: 1,
  totalSteps: 4,
  buttons: [
    { label: "Get Started", href: "#", variant: "default" },
    { label: "Skip for now", href: "#", variant: "ghost" },
  ],
  labels: {
    stepOf: "Step {current} of {total}",
  },
};

export function Onboarding1({
  badge,
  heading,
  description,
  image,
  currentStep = 1,
  totalSteps = 4,
  buttons = [],
  labels = {},
  className,
}: Onboarding1Props) {
  const mergedLabels = { ...onboarding1Demo.labels, ...labels };
  const stepText = mergedLabels.stepOf
    ?.replace("{current}", String(currentStep))
    .replace("{total}", String(totalSteps));

  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="mx-auto max-w-4xl px-4 md:px-6">
        <div className="flex flex-col items-center text-center">
          {/* Step indicator */}
          {stepText && (
            <p className="mb-4 text-sm text-muted-foreground">{stepText}</p>
          )}

          {/* Badge */}
          {badge && (
            <Badge variant="outline" className="mb-6">
              <Sparkles className="mr-1 size-3" />
              {badge}
            </Badge>
          )}

          {/* Heading */}
          {heading && (
            <h1 className="mb-4 text-3xl font-bold md:text-5xl">{heading}</h1>
          )}

          {/* Description */}
          {description && (
            <p className="mb-8 max-w-2xl text-lg text-muted-foreground">
              {description}
            </p>
          )}

          {/* Image */}
          {image && (
            <div className="relative mb-8 aspect-video w-full max-w-2xl overflow-hidden rounded-xl border">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Buttons */}
          {buttons.length > 0 && (
            <div className="flex flex-col gap-3 sm:flex-row">
              {buttons.map((button, index) => (
                <Button
                  key={index}
                  size="lg"
                  variant={button.variant ?? "default"}
                  asChild
                >
                  <Link href={button.href}>
                    {button.label}
                    {index === 0 && <ArrowRight className="size-4" />}
                  </Link>
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

"use client";

import { Check } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface UseCaseFeature {
  id: string;
  text: string;
}

interface UseCaseStep {
  id: string;
  title: string;
  description: string;
  image?: {
    src: string;
    alt: string;
  };
  features?: UseCaseFeature[];
}

interface UseCase3Props {
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "outline";
  };
  heading?: string;
  description?: string;
  steps: UseCaseStep[];
  className?: string;
}

export const usecase3Demo: UseCase3Props = {
  badge: { label: "How It Works", variant: "secondary" },
  heading: "Simple Steps to Success",
  description:
    "Follow our proven process to achieve your goals faster and more efficiently.",
  steps: [
    {
      id: "step1",
      title: "Create Your Account",
      description:
        "Sign up in seconds with your email or social accounts. No credit card required to get started with our free tier.",
      image: {
        src: "https://images.unsplash.com/photo-1757233285714-4de702bb8a56?fit=clip&w=2500&auto=format&q=60",
        alt: "Sign up screen",
      },
      features: [
        { id: "f1", text: "Email or social sign up" },
        { id: "f2", text: "Secure authentication" },
        { id: "f3", text: "No credit card required" },
        { id: "f4", text: "Instant account activation" },
      ],
    },
    {
      id: "step2",
      title: "Configure Your Workspace",
      description:
        "Set up your workspace with custom branding, invite team members, and configure integrations with your favorite tools.",
      image: {
        src: "https://images.unsplash.com/photo-1555863448-e162ecfe4d98?w=900&auto=format&fit=crop&q=60",
        alt: "Configuration dashboard",
      },
      features: [
        { id: "f5", text: "Custom branding" },
        { id: "f6", text: "Easy integrations" },
        { id: "f7", text: "Team member invites" },
        { id: "f8", text: "Role-based permissions" },
      ],
    },
    {
      id: "step3",
      title: "Start Building",
      description:
        "Use our intuitive drag-and-drop builder to create stunning pages, workflows, and automations in minutes.",
      image: {
        src: "https://images.unsplash.com/photo-1760069909042-30092767824c?fit=clip&w=2207&auto=format&q=60",
        alt: "Building interface",
      },
      features: [
        { id: "f9", text: "Drag-and-drop builder" },
        { id: "f10", text: "Pre-built templates" },
        { id: "f11", text: "Component library" },
        { id: "f12", text: "Real-time preview" },
      ],
    },
    {
      id: "step4",
      title: "Launch & Scale",
      description:
        "Deploy your project with one click and scale automatically as your traffic grows. Monitor performance in real-time.",
      image: {
        src: "https://images.unsplash.com/photo-1620678127728-7e05b93e0d03?w=900&auto=format&fit=crop&q=60",
        alt: "Launch dashboard",
      },
      features: [
        { id: "f13", text: "One-click deployment" },
        { id: "f14", text: "Real-time analytics" },
        { id: "f15", text: "Auto-scaling infrastructure" },
        { id: "f16", text: "Performance monitoring" },
      ],
    },
  ],
};

export function UseCase3({
  badge,
  heading,
  description,
  steps,
  className,
}: UseCase3Props) {
  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          {badge?.label && (
            <div className="mb-6 flex justify-center">
              <Badge variant={badge.variant ?? "secondary"}>
                {badge.label}
              </Badge>
            </div>
          )}
          {heading && (
            <h2 className="text-2xl md:text-4xl font-semibold text-balance max-w-4xl mx-auto">
              {heading}
            </h2>
          )}
          {description && (
            <p className="mt-4 text-base sm:text-lg text-muted-foreground text-balance max-w-3xl mx-auto">
              {description}
            </p>
          )}
        </div>

        {/* Numbered Steps */}
        <div className="space-y-12 md:space-y-0">
          {steps.map((step, index) => {
            const isEven = index % 2 === 0;
            const stepNumber = String(index + 1).padStart(2, "0");

            return (
              <div
                key={step.id}
                className={cn(
                  "grid gap-8 md:gap-12 items-center",
                  "md:grid-cols-2",
                  index !== steps.length - 1 && "md:mb-16"
                )}
              >
                {/* Content Side */}
                <div className={cn("space-y-4", !isEven && "md:order-2")}>
                  {/* Step Number & Title */}
                  <div className="flex flex-col md:flex-row md:items-start gap-4 -mt-6 md:-mt-0">
                    <span className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold bg-primary/10 text-primary">
                      {stepNumber}
                    </span>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Features */}
                  {step.features && step.features.length > 0 && (
                    <ul className="space-y-1.5 md:ml-16">
                      {step.features.map((feature) => (
                        <li
                          key={feature.id}
                          className="flex items-center gap-2 text-base text-muted-foreground"
                        >
                          <Check className="size-4 flex-shrink-0 text-primary" />
                          <span>{feature.text}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Image Side */}
                <div className={cn("relative", !isEven && "md:order-1")}>
                  {step.image && (
                    <div className="aspect-video rounded-lg overflow-hidden ring-1 ring-border">
                      <Image
                        src={step.image.src}
                        alt={step.image.alt}
                        width={800}
                        height={450}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

"use client";

import { Compass, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ButtonItem {
  label: string;
  href?: string;
  variant?: "default" | "secondary" | "outline" | "ghost" | "link" | "destructive";
}

interface Travel21Props {
  icon?: LucideIcon;
  heading?: string;
  description?: string;
  features?: string[];
  image?: {
    src: string;
    alt: string;
  };
  buttons?: ButtonItem[];
  displayPosition?: "left" | "right";
  className?: string;
}

export const travel21Demo: Travel21Props = {
  icon: Compass,
  heading: "Build Your Dream Trip",
  description:
    "Create a personalized travel experience tailored to your preferences, budget, and travel style. Our experts will design the perfect itinerary just for you.",
  features: [
    "Choose your destinations",
    "Set your own pace",
    "Pick your accommodations",
    "Add unique experiences",
  ],
  image: {
    src: "https://images.unsplash.com/photo-1711995624805-890dd169192c?w=800&h=600&fit=crop",
    alt: "Custom tour builder",
  },
  buttons: [{ label: "Start Building", href: "https://beste.co", variant: "default" }],
  displayPosition: "right",
};

export function Travel21({
  icon: Icon,
  heading,
  description,
  features = [],
  image,
  buttons = [],
  displayPosition = "right",
  className,
}: Travel21Props) {
  return (
    <section className={cn("py-16 md:py-24 w-full", className)}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="overflow-hidden rounded-md border bg-card">
          <div
            className={cn(
              "grid lg:grid-cols-2",
              displayPosition === "left" && "lg:[&>*:first-child]:order-2"
            )}
          >
            <div className="flex flex-col justify-center p-8 lg:p-12">
              {Icon && (
                <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
                  <Icon className="size-6" />
                </div>
              )}
              {heading && <h2 className="text-3xl font-bold md:text-4xl">{heading}</h2>}
              {description && <p className="mt-4 text-muted-foreground">{description}</p>}
              {features.length > 0 && (
                <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                  {features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <div className="size-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              )}
              {buttons.length > 0 && (
                <div className="mt-8 flex flex-wrap gap-3">
                  {buttons.map((button, index) => (
                    <Button key={index} size="lg" variant={button.variant ?? "default"} asChild>
                      <Link href={button.href ?? "#"}>{button.label}</Link>
                    </Button>
                  ))}
                </div>
              )}
            </div>
            {image && (
              <div className="relative aspect-square lg:aspect-auto">
                <img
                  className="absolute inset-0 size-full object-cover"
                  src={image.src}
                  alt={image.alt}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

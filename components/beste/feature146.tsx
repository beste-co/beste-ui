"use client";

import { Check } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BenefitItem {
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

interface Feature146Props {
  badge?: { label: string; variant?: "default" | "secondary" | "outline" };
  heading?: string;
  description?: string;
  benefits?: BenefitItem[];
  buttons?: ButtonItem[];
  className?: string;
}

export const feature146Demo: Feature146Props = {
  badge: { label: "Benefits", variant: "default" },
  heading: "Why choose us",
  description: "Key advantages of working with our platform.",
  benefits: [
    {
      title: "Save time",
      description: "Automate repetitive tasks and focus on what matters.",
    },
    {
      title: "Reduce costs",
      description: "Cut operational expenses by up to 40%.",
    },
    {
      title: "Scale easily",
      description: "Grow without worrying about infrastructure.",
    },
  ],
  buttons: [{ label: "See All Benefits", href: "https://beste.co" }],
};

export function Feature146({
  badge,
  heading,
  description,
  benefits = [],
  buttons = [],
  className,
}: Feature146Props) {
  if (benefits.length === 0) return null;

  const count = benefits.length;
  const gridCols =
    count === 1
      ? ""
      : count === 2
      ? "sm:grid-cols-2"
      : count % 3 === 0
      ? "grid-cols-1 md:grid-cols-3"
      : count % 4 === 0
      ? "sm:grid-cols-2 lg:grid-cols-4"
      : "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        {(badge || heading || description) && (
          <div className="mx-auto mb-12 max-w-3xl text-center">
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

        <div className={cn("mx-auto max-w-3xl grid gap-6", gridCols)}>
          {benefits.map((benefit, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Check className="size-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{benefit.title}</h3>
                {benefit.description && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {benefit.description}
                  </p>
                )}
              </div>
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

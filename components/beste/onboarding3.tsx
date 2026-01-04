"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, Boxes } from "lucide-react";
import Link from "next/link";

interface Onboarding3Props {
  icon?: React.ReactNode;
  heading?: string;
  description?: string;
  primaryButton?: {
    label: string;
    href: string;
  };
  className?: string;
}

export const onboarding3Demo: Onboarding3Props = {
  heading: "Welcome to Acme",
  description:
    "Your workspace is ready. Let's take a quick tour to help you get the most out of your experience.",
  primaryButton: {
    label: "Let's Go",
    href: "https://beste.co",
  },
};

export function Onboarding3({
  icon,
  heading,
  description,
  primaryButton,
  className,
}: Onboarding3Props) {
  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="mx-auto max-w-md px-4 md:px-6">
        <div className="flex flex-col items-center text-center">
          {/* Icon */}
          <div className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-primary/10">
            {icon ?? <Boxes className="size-8 text-primary" />}
          </div>

          {/* Heading */}
          {heading && (
            <h1 className="mb-3 text-2xl font-bold md:text-3xl">{heading}</h1>
          )}

          {/* Description */}
          {description && (
            <p className="mb-8 text-muted-foreground">{description}</p>
          )}

          {/* Button */}
          {primaryButton && (
            <Button size="lg" asChild>
              <Link href={primaryButton.href}>
                {primaryButton.label}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}

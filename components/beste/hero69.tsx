"use client";

import { ArrowRight, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Hero69Props {
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "outline";
  };
  heading?: string;
  description?: string;
  inputPlaceholder?: string;
  buttonLabel?: string;
  privacyText?: string;
  className?: string;
}

export const hero69Demo: Hero69Props = {
  badge: { label: "Coming Soon", variant: "secondary" },
  heading: "Be the first to know",
  description:
    "We're building something amazing. Sign up to get early access and exclusive updates.",
  inputPlaceholder: "Enter your email",
  buttonLabel: "Get Early Access",
  privacyText: "We respect your privacy. Unsubscribe at any time.",
};

export function Hero69({
  badge,
  heading,
  description,
  inputPlaceholder,
  buttonLabel,
  privacyText,
  className,
}: Hero69Props) {
  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="mx-auto max-w-3xl px-4 md:px-6">
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
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              {description}
            </p>
          )}

          <form
            className="mt-10 flex w-full max-w-md flex-col gap-3 sm:flex-row"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="email"
                placeholder={inputPlaceholder}
                className="h-10 pl-9"
              />
            </div>
            <Button type="submit" size="lg" className="h-10">
              {buttonLabel}
              <ArrowRight className="size-4" />
            </Button>
          </form>

          {privacyText && (
            <p className="mt-4 text-sm text-muted-foreground">{privacyText}</p>
          )}
        </div>
      </div>
    </section>
  );
}

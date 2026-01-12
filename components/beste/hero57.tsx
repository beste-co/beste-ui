"use client";

import { ArrowDown, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ButtonItem {
  label: string;
  href?: string;
  variant?: "default" | "secondary" | "outline" | "ghost";
}

interface Hero57Props {
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "outline";
  };
  heading?: string;
  description?: string;
  buttons?: ButtonItem[];
  scrollText?: string;
  className?: string;
}

export const hero57Demo: Hero57Props = {
  badge: { label: "Launching Soon", variant: "outline" },
  heading: "Transform your workflow with intelligent automation",
  description:
    "Streamline operations, reduce manual tasks, and focus on what matters most. Our platform handles the complexity so you can drive results.",
  buttons: [
    { label: "Get Started Free", href: "https://beste.co", variant: "default" },
    { label: "Watch Demo", href: "https://beste.co", variant: "outline" },
  ],
  scrollText: "Scroll to explore",
};

export function Hero57({
  badge,
  heading,
  description,
  buttons = [],
  scrollText,
  className,
}: Hero57Props) {
  return (
    <section
      className={cn(
        "relative flex min-h-[80vh] flex-col py-16 md:py-24",
        className
      )}
    >
      <div className="mx-auto flex max-w-4xl flex-1 flex-col items-center justify-center px-4 text-center md:px-6">
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
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
            {description}
          </p>
        )}

        {buttons.length > 0 && (
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {buttons.map((button, index) => (
              <Button
                key={index}
                variant={button.variant ?? "default"}
                size="lg"
                asChild
              >
                <Link href={button.href ?? "#"}>
                  {button.label}
                  {index === 0 && <ArrowRight className="size-4" />}
                </Link>
              </Button>
            ))}
          </div>
        )}
      </div>

      {scrollText && (
        <div className="absolute inset-x-0 bottom-8 flex flex-col items-center gap-2">
          <span className="text-sm text-muted-foreground">{scrollText}</span>
          <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-muted-foreground/30 p-1">
            <div className="size-2 animate-bounce rounded-full bg-primary" />
          </div>
          <ArrowDown className="size-4 animate-bounce text-muted-foreground" />
        </div>
      )}
    </section>
  );
}

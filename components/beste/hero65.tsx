"use client";

import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ButtonItem {
  label: string;
  href?: string;
  variant?: "default" | "secondary" | "outline" | "ghost";
}

interface Hero65Props {
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "outline";
  };
  heading?: string;
  description?: string;
  buttons?: ButtonItem[];
  videoId?: string;
  displayPosition?: "left" | "right";
  className?: string;
}

export const hero65Demo: Hero65Props = {
  badge: { label: "Watch & Learn", variant: "secondary" },
  heading: "See how teams achieve more together",
  description:
    "Watch our product walkthrough and discover how you can streamline your workflow in minutes.",
  buttons: [
    { label: "Start Free Trial", href: "https://beste.co" },
    { label: "View Pricing", href: "https://beste.co", variant: "outline" },
  ],
  videoId: "ljDOQlGpQ98",
  displayPosition: "right",
};

export function Hero65({
  badge,
  heading,
  description,
  buttons = [],
  videoId,
  displayPosition = "right",
  className,
}: Hero65Props) {
  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div
            className={cn(
              "flex flex-col",
              displayPosition === "left" ? "lg:order-2" : "lg:order-1"
            )}
          >
            {badge && (
              <Badge variant={badge.variant ?? "default"} className="mb-4">
                <Play className="size-3" />
                {badge.label}
              </Badge>
            )}

            {heading && (
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                {heading}
              </h1>
            )}

            {description && (
              <p className="mt-6 text-lg text-muted-foreground">
                {description}
              </p>
            )}

            {buttons.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-3">
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

          {videoId && (
            <div
              className={cn(
                "relative aspect-video overflow-hidden rounded-xl",
                displayPosition === "left" ? "lg:order-1" : "lg:order-2"
              )}
            >
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                title="Product video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 size-full"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

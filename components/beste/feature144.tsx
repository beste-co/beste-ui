"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ServiceItem {
  title: string;
  description?: string;
  href?: string;
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

interface Feature144Props {
  badge?: { label: string; variant?: "default" | "secondary" | "outline" };
  heading?: string;
  description?: string;
  services?: ServiceItem[];
  buttons?: ButtonItem[];
  className?: string;
}

export const feature144Demo: Feature144Props = {
  badge: { label: "Services", variant: "default" },
  heading: "What we offer",
  description: "Comprehensive solutions for your business.",
  services: [
    {
      title: "Consulting",
      description: "Strategic guidance from industry experts.",
      href: "https://beste.co",
    },
    {
      title: "Development",
      description: "Custom software built for your needs.",
      href: "https://beste.co",
    },
    {
      title: "Design",
      description: "Beautiful interfaces that users love.",
      href: "https://beste.co",
    },
    {
      title: "Support",
      description: "24/7 assistance when you need it.",
      href: "https://beste.co",
    },
  ],
  buttons: [],
};

export function Feature144({
  badge,
  heading,
  description,
  services = [],
  buttons = [],
  className,
}: Feature144Props) {
  if (services.length === 0) return null;

  const count = services.length;
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

        <div className={cn("grid gap-4", gridCols)}>
          {services.map((service, index) => (
            <Link
              key={index}
              href={service.href ?? "#"}
              className="group flex items-center justify-between rounded-xl border bg-card p-6 transition-colors hover:bg-muted/50"
            >
              <div>
                <h3 className="font-semibold group-hover:text-primary">
                  {service.title}
                </h3>
                {service.description && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {service.description}
                  </p>
                )}
              </div>
              <ArrowRight className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
            </Link>
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

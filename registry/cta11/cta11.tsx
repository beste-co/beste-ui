"use client";

import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

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
  icon?: React.ReactNode;
}

interface Cta11Props {
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "outline";
  };
  heading?: string;
  description?: string;
  buttons?: ButtonItem[];
  className?: string;
}

export const cta11Demo: Cta11Props = {
  badge: { label: "Limited Time", variant: "default" },
  heading: "Ready to get started?",
  description:
    "Join thousands of teams already using our platform to ship faster.",
  buttons: [
    {
      label: "Start Free Trial",
      href: "https://beste.co",
      icon: <ArrowRight className="size-4" />,
    },
    {
      label: "Talk to Sales",
      href: "https://beste.co",
      variant: "outline",
    },
  ],
};

export function Cta11({
  badge,
  heading,
  description,
  buttons = [],
  className,
}: Cta11Props) {
  return (
    <section className={cn("py-16 md:py-24 w-full", className)}>
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div className="rounded-md border bg-muted p-6 md:p-10">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            {/* Content */}
            <div className="flex-1">
              {badge && (
                <Badge variant={badge.variant ?? "default"} className="mb-3">
                  {badge.label}
                </Badge>
              )}

              {heading && (
                <h2
                  className="text-2xl font-bold md:text-3xl [&>strong]:text-primary [&>strong]:font-bold"
                  dangerouslySetInnerHTML={{ __html: heading }}
                />
              )}

              {description && (
                <p className="mt-2 text-sm text-muted-foreground md:text-base">
                  {description}
                </p>
              )}
            </div>

            {/* Buttons */}
            {buttons.length > 0 && (
              <div className="flex shrink-0 flex-wrap gap-3">
                {buttons.map((button, index) => (
                  <Button
                    key={index}
                    variant={button.variant ?? "default"}
                    asChild
                  >
                    <Link href={button.href ?? "#"}>
                      {button.label}
                      {button.icon}
                    </Link>
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

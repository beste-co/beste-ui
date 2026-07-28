"use client";

import { ArrowRight, Bell, CheckCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface UpdateItem {
  text: string;
  isNew?: boolean;
}

interface ButtonItem {
  label: string;
  href?: string;
  variant?: "default" | "secondary" | "outline" | "ghost";
}

interface Hero63Props {
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "outline";
  };
  heading?: string;
  description?: string;
  updates?: UpdateItem[];
  buttons?: ButtonItem[];
  className?: string;
}

export const hero63Demo: Hero63Props = {
  badge: { label: "What's New", variant: "secondary" },
  heading: "Latest updates and features",
  description: "Stay up to date with the newest additions to our platform",
  updates: [
    { text: "AI-powered code suggestions", isNew: true },
    { text: "Real-time collaboration mode", isNew: true },
    { text: "Enhanced security features", isNew: false },
    { text: "New integrations with popular tools", isNew: false },
  ],
  buttons: [
    { label: "Explore Features", href: "https://beste.co", variant: "default" },
    { label: "View Changelog", href: "https://beste.co", variant: "outline" },
  ],
};

export function Hero63({
  badge,
  heading,
  description,
  updates = [],
  buttons = [],
  className,
}: Hero63Props) {
  return (
    <section className={cn("py-16 md:py-24 w-full", className)}>
      <div className="mx-auto max-w-4xl px-4 md:px-6">
        <div className="flex flex-col items-center text-center">
          {badge && (
            <Badge variant={badge.variant ?? "secondary"} className="mb-6">
              <Bell className="size-3" />
              {badge.label}
            </Badge>
          )}

          {heading && (
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              {heading}
            </h1>
          )}

          {description && (
            <p className="mt-4 text-lg text-muted-foreground">{description}</p>
          )}

          {updates.length > 0 && (
            <div className="mt-10 w-full max-w-md rounded-xl border bg-card p-6">
              <ul className="space-y-3 text-left">
                {updates.map((update, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="size-5 shrink-0 text-primary" />
                    <span className="text-sm">{update.text}</span>
                    {update.isNew && (
                      <Badge variant="default" className="ml-auto text-xs">
                        New
                      </Badge>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {buttons.length > 0 && (
            <div className="mt-8 flex flex-wrap justify-center gap-3">
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
      </div>
    </section>
  );
}

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Mail } from "lucide-react";
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
}

interface Cta8Props {
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "outline";
  };
  heading?: string;
  description?: string;
  buttons?: ButtonItem[];
  footnote?: string;
  className?: string;
}

export const cta8Demo: Cta8Props = {
  badge: { label: "Newsletter", variant: "secondary" },
  heading: "Stay in the <strong>loop</strong>",
  description:
    "Get the latest updates, articles, and resources delivered straight to your inbox every week. Join thousands of subscribers.",
  buttons: [
    { label: "Subscribe Now", href: "https://beste.co" },
    { label: "Learn More", href: "https://beste.co", variant: "outline" },
  ],
  footnote: "No spam. Unsubscribe anytime.",
};

export function Cta8({
  badge,
  heading,
  description,
  buttons = [],
  footnote,
  className,
}: Cta8Props) {
  return (
    <section className={cn("py-16 md:py-24 w-full", className)}>
      <div className="mx-auto max-w-3xl px-4 md:px-6">
        <div className="flex flex-col items-center text-center gap-4">
          {badge && (
            <Badge variant={badge.variant ?? "secondary"}>
              <Mail className="size-3" />
              {badge.label}
            </Badge>
          )}

          {heading && (
            <h2
              className="text-3xl font-bold md:text-4xl lg:text-5xl [&>strong]:text-primary [&>strong]:font-bold"
              dangerouslySetInnerHTML={{ __html: heading }}
            />
          )}

          {description && (
            <p className="max-w-xl text-base text-muted-foreground md:text-lg text-balance">
              {description}
            </p>
          )}

          {buttons.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-3 justify-center">
              {buttons.map((button, index) => (
                <Button
                  key={index}
                  variant={button.variant ?? "default"}
                  asChild
                >
                  <Link href={button.href ?? "#"}>{button.label}</Link>
                </Button>
              ))}
            </div>
          )}

          {footnote && (
            <p className="text-xs text-muted-foreground">{footnote}</p>
          )}
        </div>
      </div>
    </section>
  );
}

"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Badge23 } from "@/components/beste/component/badge23";
import { Button21 } from "@/components/beste/component/button21";
import { cn } from "@/lib/utils";

interface Badge {
  label: string;
}

interface ActionLink {
  label: string;
  href: string;
  tone?: "primary" | "neutral" | "outline";
}

interface HelpLink {
  title: string;
  description: string;
  href: string;
}

interface Error34Props {
  badge?: Badge;
  heading?: string;
  description?: string;
  buttons?: ActionLink[];
  linksLabel?: string;
  links?: HelpLink[];
  className?: string;
}

export const error34Demo: Error34Props = {
  badge: { label: "Error 404" },
  heading: "This page moved, or never existed",
  description:
    "The link you followed does not lead anywhere on Sirius. Nothing is broken on your side, and your workspace is untouched.",
  buttons: [
    { label: "Back to home", href: "https://beste.co" },
    { label: "Search the docs", href: "https://beste.co", tone: "outline" },
  ],
  linksLabel: "Where people usually go from here",
  links: [
    {
      title: "Product tour",
      description: "See how intake, scheduling, records, and billing sit on one surface.",
      href: "https://beste.co",
    },
    {
      title: "Help centre",
      description: "Setup guides, imports, and answers written by the team that ships.",
      href: "https://beste.co",
    },
    {
      title: "Release notes",
      description: "Everything that shipped this quarter, and what it changed for staff.",
      href: "https://beste.co",
    },
    {
      title: "Talk to us",
      description: "A real person, usually the same working day.",
      href: "https://beste.co",
    },
  ],
};

export function Error34({
  badge,
  heading,
  description,
  buttons = [],
  linksLabel,
  links = [],
  className,
}: Error34Props) {
  return (
    <section className={cn("bg-background py-16 md:py-24 w-full", className)}>
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid gap-12 md:grid-cols-2 md:gap-16">
          <div>
            {badge && <Badge23 label={badge.label} />}
            {heading && (
              <h1 className="mt-6 text-4xl font-light leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl">
                {heading}
              </h1>
            )}
            {description && (
              <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
                {description}
              </p>
            )}
            {buttons.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-3">
                {buttons.map((button, index) => (
                  <Button21 key={index} asChild label={button.label} tone={button.tone}>
                    <Link href={button.href} />
                  </Button21>
                ))}
              </div>
            )}
          </div>

          <div className="md:pt-2">
            {linksLabel && <p className="text-base text-muted-foreground">{linksLabel}</p>}
            <div className="mt-4 border-t border-border">
              {links.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="group/error34 flex items-start justify-between gap-6 border-b border-border py-5"
                >
                  <span className="flex flex-col gap-1">
                    <span className="text-lg font-medium text-foreground transition-colors group-hover/error34:text-primary">
                      {link.title}
                    </span>
                    <span className="text-base leading-relaxed text-muted-foreground">
                      {link.description}
                    </span>
                  </span>
                  <ArrowUpRight
                    className="mt-1 size-5 shrink-0 text-muted-foreground transition-transform motion-safe:group-hover/error34:translate-x-0.5 motion-safe:group-hover/error34:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

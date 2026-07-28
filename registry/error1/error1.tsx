"use client";

import { ArrowRight, House, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ActionButton {
  label: string;
  href: string;
  variant?: "default" | "outline" | "secondary" | "ghost";
  icon?: LucideIcon;
}

interface QuickLink {
  label: string;
  href: string;
}

interface Error1Props {
  code?: string;
  heading?: string;
  description?: string;
  buttons?: ActionButton[];
  linksLabel?: string;
  links?: QuickLink[];
  className?: string;
}

export const error1Demo: Error1Props = {
  code: "404",
  heading: "This page could not be found",
  description:
    "The page you are looking for was moved, renamed, or never existed. Check the address, or pick one of the pages below.",
  buttons: [
    { label: "Back to home", href: "https://beste.co", icon: House },
    { label: "Contact support", href: "https://beste.co", variant: "outline" },
  ],
  linksLabel: "Popular pages",
  links: [
    { label: "Documentation", href: "https://beste.co" },
    { label: "Pricing", href: "https://beste.co" },
    { label: "Blog", href: "https://beste.co" },
    { label: "Changelog", href: "https://beste.co" },
  ],
};

export function Error1({
  code,
  heading,
  description,
  buttons = [],
  linksLabel,
  links = [],
  className,
}: Error1Props) {
  return (
    <section className={cn("py-16 md:py-24 w-full", className)}>
      <div className="mx-auto max-w-2xl px-4 text-center md:px-6">
        {code && (
          <p className="text-7xl font-bold tracking-tight text-muted-foreground md:text-8xl">
            {code}
          </p>
        )}

        {heading && (
          <h1 className="mt-6 text-balance text-3xl font-bold tracking-tight md:text-4xl">
            {heading}
          </h1>
        )}

        {description && (
          <p className="mx-auto mt-4 max-w-xl text-balance text-base text-muted-foreground md:text-lg">
            {description}
          </p>
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
                <Link href={button.href}>
                  {button.icon && <button.icon className="size-4" />}
                  {button.label}
                </Link>
              </Button>
            ))}
          </div>
        )}

        {links.length > 0 && (
          <div className="mt-12 border-t pt-8">
            {linksLabel && (
              <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                {linksLabel}
              </p>
            )}
            <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-3">
              {links.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="group/error1 inline-flex items-center gap-1.5 text-base font-medium text-foreground transition-colors hover:text-muted-foreground"
                >
                  {link.label}
                  <ArrowRight className="size-4 transition-transform group-hover/error1:translate-x-0.5" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

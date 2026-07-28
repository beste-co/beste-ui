"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoItem {
  name: string;
  logo: string;
}

interface ButtonItem {
  label: string;
  href?: string;
  variant?: "default" | "secondary" | "outline" | "ghost" | "link" | "destructive";
}

interface Feature135Props {
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "outline";
  };
  heading?: string;
  description?: string;
  logos?: LogoItem[];
  buttons?: ButtonItem[];
  className?: string;
}

export const feature135Demo: Feature135Props = {
  badge: { label: "Integrations", variant: "default" },
  heading: "Works with your stack",
  description: "Connect with the tools you already use.",
  logos: [
    { name: "Nike", logo: "https://oud.pics/sm/l/nike.png" },
    { name: "Adidas", logo: "https://oud.pics/sm/l/adidas.png" },
    { name: "Puma", logo: "https://oud.pics/sm/l/puma.png" },
    { name: "Converse", logo: "https://oud.pics/sm/l/converse.png" },
  ],
  buttons: [{ label: "View All Integrations", href: "https://beste.co" }],
};

export function Feature135({
  badge,
  heading,
  description,
  logos = [],
  buttons = [],
  className,
}: Feature135Props) {
  return (
    <section className={cn("py-16 md:py-24 w-full", className)}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        {(badge || heading || description) && (
          <div className="mx-auto mb-12 max-w-3xl text-center">
            {badge && (
              <div className="mb-4 flex justify-center">
                <Badge variant={badge.variant ?? "default"}>{badge.label}</Badge>
              </div>
            )}
            {heading && <h2 className="text-3xl font-semibold md:text-5xl">{heading}</h2>}
            {description && (
              <p className="mt-4 text-base md:text-lg text-muted-foreground">{description}</p>
            )}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
          {logos.map((item, index) => (
            <div
              key={index}
              className="flex h-10 w-24 items-center justify-center opacity-50 grayscale transition-all hover:opacity-100 hover:grayscale-0"
            >
              <img
                src={item.logo}
                alt={item.name}
                width={96}
                height={40}
                className="max-h-full w-auto object-contain"
              />
            </div>
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

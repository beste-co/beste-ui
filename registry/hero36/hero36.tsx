"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ButtonItem {
  label: string;
  href?: string;
  variant?: "default" | "secondary" | "outline" | "ghost";
}

interface LogoItem {
  name: string;
  logo: string;
  href?: string;
}

interface Hero36Props {
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "outline";
  };
  heading?: string;
  description?: string;
  buttons?: ButtonItem[];
  trustedBy?: {
    label: string;
    logos: LogoItem[];
  };
  className?: string;
}

export const hero36Demo: Hero36Props = {
  badge: { label: "Introducing v2.0", variant: "outline" },
  heading: "The future of <strong>product development</strong>",
  description:
    "Build, test, and ship products faster than ever. Our platform gives teams the tools they need to move from idea to launch in record time.",
  buttons: [
    { label: "Start Free Trial", href: "https://beste.co", variant: "default" },
    { label: "Book a Demo", href: "https://beste.co", variant: "outline" },
  ],
  trustedBy: {
    label: "Trusted by innovative teams",
    logos: [
      {
        name: "Adidas",
        logo: "https://oud.pics/sm/l/adidas.png",
        href: "https://beste.co",
      },
      {
        name: "Puma",
        logo: "https://oud.pics/sm/l/puma.png",
        href: "https://beste.co",
      },
      {
        name: "New Balance",
        logo: "https://oud.pics/sm/l/new-balance.png",
        href: "https://beste.co",
      },
      {
        name: "Converse",
        logo: "https://oud.pics/sm/l/converse.png",
        href: "https://beste.co",
      },
    ],
  },
};

export function Hero36({
  badge,
  heading,
  description,
  buttons = [],
  trustedBy,
  className,
}: Hero36Props) {
  return (
    <section className={cn("relative overflow-hidden py-24 md:py-32 w-full", className)}>
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div className="flex flex-col items-center text-center">
          {badge && (
            <Badge variant={badge.variant ?? "default"} className="mb-6">
              {badge.label}
            </Badge>
          )}

          {heading && (
            <h1
              className="text-4xl font-bold tracking-tight [&>strong]:bg-gradient-to-r [&>strong]:from-primary [&>strong]:via-primary/80 [&>strong]:to-primary [&>strong]:bg-clip-text [&>strong]:text-transparent [&>strong]:font-bold md:text-5xl lg:text-6xl"
              dangerouslySetInnerHTML={{ __html: heading }}
            />
          )}

          {description && (
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">{description}</p>
          )}

          {buttons.length > 0 && (
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              {buttons.map((button, index) => (
                <Button key={index} variant={button.variant ?? "default"} size="lg" asChild>
                  <Link href={button.href ?? "#"}>
                    {button.label}
                    {index === 0 && <ArrowRight className="size-4" />}
                  </Link>
                </Button>
              ))}
            </div>
          )}

          {trustedBy && (
            <div className="mt-12 md:mt-16">
              <p className="mb-6 text-sm text-muted-foreground">{trustedBy.label}</p>
              <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
                {trustedBy.logos.map((logo, index) => (
                  <Link
                    key={index}
                    href={logo.href ?? "#"}
                    className="grayscale opacity-50 transition-all hover:grayscale-0 hover:opacity-100"
                  >
                    <img
                      src={logo.logo}
                      alt={logo.name}
                      width={100}
                      height={32}
                      className="h-8 w-auto object-contain"
                    />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

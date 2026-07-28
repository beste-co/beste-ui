"use client";

import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface GridItem {
  title: string;
  description?: string;
  image: { src: string; alt: string };
  href?: string;
}

interface ButtonItem {
  label: string;
  href: string;
  variant?: "default" | "secondary" | "outline" | "ghost";
}

interface Feature63Props {
  badge?: {
    label: string;
    icon?: React.ReactNode;
    variant?: "default" | "secondary" | "outline";
  };
  heading?: string;
  description?: string;
  items?: GridItem[];
  buttons?: ButtonItem[];
  className?: string;
}

export const feature63Demo: Feature63Props = {
  badge: { label: "Solutions", variant: "default" },
  heading: "Built for every team",
  description: "Explore how different teams use our platform to achieve their goals.",
  items: [
    {
      title: "Marketing",
      description: "Track campaigns and measure ROI",
      image: {
        src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
        alt: "Marketing",
      },
      href: "https://beste.co",
    },
    {
      title: "Engineering",
      description: "Ship faster with better tools",
      image: {
        src: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=600&h=400&fit=crop",
        alt: "Engineering",
      },
      href: "https://beste.co",
    },
    {
      title: "Design",
      description: "Collaborate on creative projects",
      image: {
        src: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop",
        alt: "Design",
      },
      href: "https://beste.co",
    },
    {
      title: "Sales",
      description: "Close deals with better insights",
      image: {
        src: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
        alt: "Sales",
      },
      href: "https://beste.co",
    },
    {
      title: "Product",
      description: "Build what users really need",
      image: {
        src: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&h=400&fit=crop",
        alt: "Product",
      },
      href: "https://beste.co",
    },
    {
      title: "Operations",
      description: "Streamline your workflows",
      image: {
        src: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop",
        alt: "Operations",
      },
      href: "https://beste.co",
    },
  ],
  buttons: [{ label: "See all use cases", href: "https://beste.co" }],
};

export function Feature63({
  badge,
  heading,
  description,
  items = [],
  buttons = [],
  className,
}: Feature63Props) {
  return (
    <section className={cn("py-16 md:py-24 w-full", className)}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        {(badge || heading || description) && (
          <div className="mx-auto mb-12 max-w-3xl text-center">
            {badge && (
              <div className="mb-4 flex justify-center">
                <Badge variant={badge.variant ?? "default"} className="gap-1.5">
                  {badge.icon}
                  {badge.label}
                </Badge>
              </div>
            )}
            {heading && (
              <h2 className="text-2xl font-semibold tracking-tight md:text-4xl">{heading}</h2>
            )}
            {description && (
              <p className="mt-4 text-base text-muted-foreground md:text-lg">{description}</p>
            )}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => {
            const CardContent = (
              <>
                <img
                  className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover/feature63:scale-105"
                  src={item.image.src}
                  alt={item.image.alt}
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <div className="flex items-end justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                      {item.description && (
                        <p className="mt-1 text-sm text-white/80">{item.description}</p>
                      )}
                    </div>
                    {item.href && (
                      <ArrowUpRight className="size-5 text-white opacity-0 transition-all duration-300 group-hover/feature63:opacity-100" />
                    )}
                  </div>
                </div>
              </>
            );

            if (item.href) {
              return (
                <Link
                  key={index}
                  href={item.href}
                  className="group/feature63 relative aspect-[3/2] overflow-hidden rounded-md"
                >
                  {CardContent}
                </Link>
              );
            }

            return (
              <div
                key={index}
                className="group/feature63 relative aspect-[3/2] overflow-hidden rounded-md"
              >
                {CardContent}
              </div>
            );
          })}
        </div>

        {buttons.length > 0 && (
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            {buttons.map((button, index) => (
              <Button key={index} variant={button.variant ?? "default"} asChild>
                <Link href={button.href}>{button.label}</Link>
              </Button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { Badge7 } from "@/components/beste/component/badge7";
import { Button12 } from "@/components/beste/component/button12";
import { cn } from "@/lib/utils";

interface PillarImage {
  src: string;
  alt: string;
}

interface Pillar {
  title: string;
  description: string;
  image: PillarImage;
}

interface Badge {
  label: string;
}

interface ActionButton {
  label: string;
  href: string;
}

interface Feature230Props {
  badge?: Badge;
  heading?: string;
  button?: ActionButton;
  items?: Pillar[];
  className?: string;
}

export const feature230Demo: Feature230Props = {
  badge: { label: "Three pillars" },
  heading: "What holds the work <strong>together.</strong>",
  button: { label: "See it in the work", href: "https://beste.co" },
  items: [
    {
      title: "Restraint",
      description:
        "We cut until only the load-bearing idea remains. A page earns each element it keeps, and silence does the rest of the talking.",
      image: {
        src: "https://images.unsplash.com/photo-1562146398-1b732c203bc4?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        alt: "Empty minimal interior with a single bench and tall windows",
      },
    },
    {
      title: "Material honesty",
      description:
        "Type is type, grid is grid, photograph is photograph. Nothing pretends to be something it is not, so the surface always reads as true.",
      image: {
        src: "https://images.unsplash.com/photo-1536185752-9dc80dd63510?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        alt: "Close detail of concrete and timber meeting at a seam",
      },
    },
    {
      title: "Patience",
      description:
        "Good systems reveal themselves slowly. We hold a draft longer than feels comfortable so the final version can feel inevitable.",
      image: {
        src: "https://images.unsplash.com/photo-1516247524857-8dc5f4786cb3?q=80&w=1035&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        alt: "Hands arranging printed proofs across a wide studio table",
      },
    },
  ],
};

export function Feature230({ badge, heading, button, items = [], className }: Feature230Props) {
  return (
    <section className={cn("py-16 md:py-24 w-full", className)}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            {badge && <Badge7 label={badge.label} />}
            {heading && (
              <h2
                className="mt-6 text-balance text-3xl font-bold leading-[1.05] tracking-tight text-foreground md:text-4xl lg:text-5xl [&>strong]:font-bold [&>strong]:text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: heading }}
              />
            )}
          </div>

          {button && (
            <Button12 asChild label={button.label} className="shrink-0">
              <Link href={button.href} />
            </Button12>
          )}
        </div>

        {items.length > 0 && (
          <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-12 md:mt-20 md:grid-cols-3 md:gap-x-10">
            {items.map((item, index) => (
              <div key={index} className="group/feature230 flex flex-col">
                <div className="relative aspect-[3/4] overflow-hidden rounded-md bg-muted">
                  <img
                    className="absolute inset-0 size-full object-cover"
                    src={item.image.src}
                    alt={item.image.alt}
                  />
                </div>
                <span className="mt-6 text-base font-semibold tabular-nums text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-xl font-semibold tracking-tight text-foreground">
                  {item.title}
                </h3>
                <p className="mt-3 text-base text-muted-foreground md:text-lg">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

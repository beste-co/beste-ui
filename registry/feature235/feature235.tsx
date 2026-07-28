"use client";

import { Clock, Layers, type LucideIcon, Quote, Repeat, ShieldCheck } from "lucide-react";
import { Badge7 } from "@/components/beste/component/badge7";
import { Button12 } from "@/components/beste/component/button12";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Badge {
  label: string;
}

interface ActionButton {
  label: string;
  href: string;
}

interface Author {
  name: string;
  role: string;
  image: { src: string; alt: string };
}

interface Feature235Item {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface Feature235Props {
  badge?: Badge;
  heading?: string;
  description?: string;
  button?: ActionButton;
  quote?: string;
  author?: Author;
  items?: Feature235Item[];
  className?: string;
}

export const feature235Demo: Feature235Props = {
  badge: { label: "Proof in use" },
  heading: "Loved <strong>where it matters.</strong>",
  description:
    "The work is only finished when a team can run it without us. Here is what that looks like in practice — and what one of them said when we stepped back.",
  button: { label: "Read the case study", href: "https://beste.co" },
  quote:
    "Auralis didn't hand us a logo and disappear. They rebuilt how the whole company sounds, looks, and moves — then stayed in the room until our own team could carry it.",
  author: {
    name: "Priya Raman",
    role: "VP Brand, Northwind",
    image: {
      src: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop",
      alt: "Portrait of Priya Raman",
    },
  },
  items: [
    {
      icon: Clock,
      title: "Same-day answers",
      description:
        "A shared channel, never a ticket queue. Questions get a reply while the idea is still warm.",
    },
    {
      icon: ShieldCheck,
      title: "Files you own",
      description:
        "Every source, layer, and licensed font handed over clean. No lock-in, no vendor leash.",
    },
    {
      icon: Layers,
      title: "One system, every surface",
      description:
        "Decks, sites, and signage drawn from a single rule set, so nothing quietly drifts apart.",
    },
    {
      icon: Repeat,
      title: "Made to hand off",
      description:
        "Documented enough that your team ships the next thing long after we leave the room.",
    },
  ],
};

export function Feature235({
  badge,
  heading,
  description,
  button,
  quote,
  author,
  items = [],
  className,
}: Feature235Props) {
  return (
    <section className={cn("py-16 md:py-24 w-full", className)}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            {badge && <Badge7 label={badge.label} />}
            {heading && (
              <h2
                className="mt-6 text-balance text-3xl font-bold leading-tight tracking-tight text-foreground md:text-4xl lg:text-5xl [&>strong]:font-bold [&>strong]:text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: heading }}
              />
            )}
            {description && (
              <p className="mt-6 text-lg text-muted-foreground md:text-xl">{description}</p>
            )}
          </div>

          {button && (
            <Button12 asChild label={button.label} className="shrink-0">
              <Link href={button.href} />
            </Button12>
          )}
        </div>

        <div className="mt-12 grid gap-6 md:mt-16 lg:grid-cols-2 lg:items-stretch">
          {quote && author && (
            <figure className="flex flex-col justify-between rounded-md bg-muted p-8 md:p-10">
              <Quote className="size-10 text-muted-foreground" aria-hidden="true" />
              <blockquote className="mt-8 text-balance text-xl font-medium leading-snug text-foreground md:text-2xl">
                {quote}
              </blockquote>
              <figcaption className="mt-10 flex items-center gap-4">
                <div className="relative size-12 shrink-0 overflow-hidden rounded-full bg-background">
                  <img
                    className="absolute inset-0 size-full object-cover"
                    src={author.image.src}
                    alt={author.image.alt}
                  />
                </div>
                <div>
                  <p className="text-base font-semibold text-foreground">{author.name}</p>
                  <p className="text-base text-muted-foreground">{author.role}</p>
                </div>
              </figcaption>
            </figure>
          )}

          {items.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2">
              {items.map((item, index) => (
                <div key={index} className="group/feature235 flex flex-col rounded-md bg-muted p-6">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-background text-foreground">
                    <item.icon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-xl font-semibold tracking-tight text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-base text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

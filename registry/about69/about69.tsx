"use client";

import { Badge23 } from "@/components/beste/component/badge23";
import { cn } from "@/lib/utils";

interface Badge {
  label: string;
}

interface AboutImage {
  src: string;
  alt: string;
}

interface Principle {
  title: string;
  description: string;
}

interface About69Props {
  badge?: Badge;
  heading?: string;
  description?: string;
  image?: AboutImage;
  items?: Principle[];
  className?: string;
}

export const about69Demo: About69Props = {
  badge: { label: "About" },
  heading: "Software for people who cannot afford a bad Tuesday",
  description:
    "We started Sirius after a decade of watching good practices run on tools that were never designed for the pace of a real clinic day.",
  image: {
    src: "https://images.unsplash.com/photo-1678380003465-e8b1b9e3877c?q=80&w=2228&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "A small team talking around a laptop",
  },
  items: [
    {
      title: "We sit behind the desk first",
      description:
        "Nothing ships until someone on the team has watched it used on a busy morning, in a real practice, with a queue forming.",
    },
    {
      title: "The record belongs to the practice",
      description:
        "Export everything, any time, in an open format. Leaving should be as easy as joining, and we would rather earn the renewal.",
    },
    {
      title: "Quiet beats clever",
      description:
        "A feature that needs explaining is a feature that failed. We remove more than we add, and we count that as progress.",
    },
  ],
};

export function About69({
  badge,
  heading,
  description,
  image,
  items = [],
  className,
}: About69Props) {
  return (
    <section className={cn("bg-background py-16 md:py-24 w-full", className)}>
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        {badge && <Badge23 label={badge.label} />}

        <div className="mt-6 border-t border-border pt-8 md:pt-10">
          <div className="grid gap-6 md:grid-cols-2 md:gap-12">
            {heading && (
              <h2 className="text-3xl font-light leading-[1.1] tracking-tight text-foreground md:text-5xl">
                {heading}
              </h2>
            )}
            {description && (
              <div className="flex md:justify-end">
                <p className="max-w-md text-base leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>
            )}
          </div>
        </div>

        {image && (
          <div className="relative mt-12 h-72 overflow-hidden rounded-md md:mt-16 md:h-96">
            <img
              className="absolute inset-0 size-full object-cover"
              src={image.src}
              alt={image.alt}
            />
          </div>
        )}

        <div className="mt-12 grid gap-8 md:grid-cols-3 md:gap-12">
          {items.map((item, index) => (
            <div key={index} className="border-t border-border pt-6">
              <span className="text-sm text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-xl font-light tracking-tight text-foreground md:text-2xl">
                {item.title}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

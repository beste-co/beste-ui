"use client";

import { cn } from "@/lib/utils";

interface StepItem {
  badge: string;
  title: string;
  description: string;
}

interface Portfolio84Props {
  heading?: string;
  description?: string;
  items?: StepItem[];
  className?: string;
}

export const portfolio84Demo: Portfolio84Props = {
  heading: "My Process",
  description: "How I approach every project from start to finish.",
  items: [
    {
      badge: "01",
      title: "Discovery",
      description:
        "Understanding your goals, users, and constraints through research and stakeholder interviews.",
    },
    {
      badge: "02",
      title: "Strategy",
      description:
        "Defining the approach, creating information architecture, and mapping user journeys.",
    },
    {
      badge: "03",
      title: "Design",
      description:
        "Wireframes, visual design, prototyping, and iterating based on feedback.",
    },
    {
      badge: "04",
      title: "Deliver",
      description:
        "Developer handoff, quality assurance, and ongoing support post-launch.",
    },
  ],
};

export function Portfolio84({
  heading,
  description,
  items = [],
  className,
}: Portfolio84Props) {
  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        {(heading || description) && (
          <div className="mb-12 text-center">
            {heading && (
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                {heading}
              </h2>
            )}
            {description && (
              <p className="mt-4 text-lg text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        )}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => (
            <div key={index} className="text-center">
              {item.badge && (
                <span className="text-5xl font-bold text-primary/20">
                  {item.badge}
                </span>
              )}
              <h3 className="mt-4 text-xl font-semibold">{item.title}</h3>
              {item.description && (
                <p className="mt-2 text-muted-foreground">{item.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

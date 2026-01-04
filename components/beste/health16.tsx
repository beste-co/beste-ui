"use client";

import { cn } from "@/lib/utils";

interface Statistic {
  id: string;
  value: string;
  label: string;
  description?: string;
}

interface Health16Props {
  eyebrow?: string;
  heading?: string;
  description?: string;
  statistics?: Statistic[];
  className?: string;
}

export const health16Demo: Health16Props = {
  eyebrow: "By The Numbers",
  heading: "Trusted by thousands worldwide",
  description:
    "Our commitment to excellence has helped countless individuals achieve their health and wellness goals.",
  statistics: [
    {
      id: "stat-1",
      value: "50,000+",
      label: "Active Members",
      description: "People actively pursuing their wellness journey with us",
    },
    {
      id: "stat-2",
      value: "98%",
      label: "Satisfaction Rate",
      description: "Members who report improved quality of life",
    },
    {
      id: "stat-3",
      value: "500+",
      label: "Expert Practitioners",
      description: "Certified professionals across all disciplines",
    },
    {
      id: "stat-4",
      value: "15",
      label: "Years of Excellence",
      description: "Pioneering wellness solutions since 2009",
    },
  ],
};

export function Health16({
  eyebrow,
  heading,
  description,
  statistics = [],
  className,
}: Health16Props) {
  if (statistics.length === 0) return null;

  const count = statistics.length;
  const gridCols =
    count === 1
      ? "lg:grid-cols-1 max-w-md mx-auto"
      : count === 2
      ? "lg:grid-cols-2"
      : count % 3 === 0
      ? "lg:grid-cols-3"
      : count === 4
      ? "lg:grid-cols-4"
      : "lg:grid-cols-4";

  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        {/* Header */}
        {(eyebrow || heading || description) && (
          <div className="mb-16 text-center">
            {eyebrow && (
              <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground">
                {eyebrow}
              </p>
            )}
            {heading && (
              <h2 className="mt-4 text-3xl font-light tracking-tight md:text-5xl">
                {heading}
              </h2>
            )}
            {description && (
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Statistics Grid */}
        <div className={cn("grid gap-8 md:grid-cols-2", gridCols)}>
          {statistics.map((stat) => (
            <div key={stat.id} className="relative text-center">
              <div className="text-5xl font-light tracking-tight md:text-6xl">
                {stat.value}
              </div>
              <div className="mt-4 text-lg font-medium">{stat.label}</div>
              {stat.description && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {stat.description}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Decorative divider */}
        <div className="mx-auto mt-16 h-px w-32 bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>
    </section>
  );
}
